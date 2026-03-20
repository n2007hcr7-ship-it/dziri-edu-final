import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Groups from './pages/Groups';
import Payment from './pages/Payment'; // تأكد من استيراد صفحة الدفع

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* الصفحة الرئيسية */}
          <Route path="/" element={<Home />} />
          
          {/* صفحة تفعيل الحساب (الدفع) */}
          <Route path="/payment" element={<Payment />} />
          
          {/* بقية الصفحات */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/groups" element={<Groups />} />
          
          {/* في حال كتابة رابط خاطئ، يعود للرئيسية */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}