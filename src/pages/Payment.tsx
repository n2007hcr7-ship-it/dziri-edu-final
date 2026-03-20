import { useState } from 'react';
// تأكد أنك تملك ملف firebase.ts في مجلد src لإتمام الربط
import { storage, db } from '../firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const Payment = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // معلومات حسابك الـ CCP - يمكنك تعديلها ببياناتك الحقيقية
  const ccpInfo = {
    name: "ANAS [اسمك الكامل هنا]",
    account: "12345678",
    key: "90",
    rip: "00799999001234567890"
  };

  const handleUpload = async () => {
    if (!file) {
      alert("من فضلك اختر صورة وصل الدفع أولاً");
      return;
    }
    
    setLoading(true);
    try {
      // 1. رفع الصورة إلى Storage
      const storageRef = ref(storage, `receipts/ccp_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // 2. حفظ الطلب في Firestore لكي تراه في لوحة التحكم
      await addDoc(collection(db, "payment_requests"), {
        receiptUrl: url,
        status: "pending",
        createdAt: new Date(),
        type: "CCP_PAYMENT"
      });

      alert("تم إرسال وصل الدفع بنجاح! سيتم التحقق من حسابك وتفعيله قريباً.");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الرفع، تأكد من اتصال الإنترنت.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#2d5a27' }}>تفعيل الحساب عبر بريد الجزائر (CCP)</h2>
      
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', border: '1px solid #ddd' }}>
        <p>يرجى إرسال مبلغ الاشتراك إلى الحساب التالي:</p>
        <p><b>الاسم الكامل:</b> {ccpInfo.name}</p>
        <p><b>رقم الحساب (CCP):</b> {ccpInfo.account} <b>المفتاح:</b> {ccpInfo.key}</p>
        <p><b>رقم الـ RIP:</b> <span style={{ letterSpacing: '1px' }}>{ccpInfo.rip}</span></p>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          بعد الدفع، قم بتصوير الوصل ورفعه هنا:
        </label>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
          accept="image/*"
          style={{ marginBottom: '15px' }}
        />
        <br />
        <button 
          onClick={handleUpload} 
          disabled={loading}
          style={{
            background: '#2d5a27',
            color: 'white',
            padding: '10px 25px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? "جاري إرسال البيانات..." : "تأكيد وإرسال الوصل"}
        </button>
      </div>
    </div>
  );
};

export default Payment;