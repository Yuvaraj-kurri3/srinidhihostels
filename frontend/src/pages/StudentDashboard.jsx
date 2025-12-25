import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    User,
    CreditCard,
    Home,
    Phone,
    BookOpen,
    AlertCircle,
    ChevronRight,
    MessageSquare,
    Utensils,
    Calendar,
    MapPin,
    ShieldCheck,
    ArrowRight,
    Menu,
    LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import './StudentDashboard.css';
import Navbar from '../components/Navbar';
import LocationMap from '../components/LocationMap';
import AddStudent from '../components/AddStudent';
import axios from 'axios';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const Api="https://srinidhihostelsbackend.onrender.com/";

    useEffect(() => {
        const checkLogin = () => {
            const storedUser = sessionStorage.getItem('user');
            if (!storedUser) {
                alert("Please login to access your details");
                navigate("/login");
            } else {
                if (JSON.parse(storedUser).role.toLowerCase() !== "student") {
                    alert("Access denied. Students only.");
                    navigate("/");
                    return;
                }
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };

        const timer = setTimeout(checkLogin, 800);
        return () => clearTimeout(timer);
    }, [navigate]);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = user?.email;
                if (email) {
                    const response = await axios.get(`${Api}api/students/getstudentbymail/${email}`);
                    console.log('Student details response:', response);
                    if (response.status === 200 && response.data.data===null) {
                        alert("please add your data");
                    }
                    else{
                        const data = response.data.data;
                        // You can set more user details here if needed
                        setUser((prevUser) => ({
                            ...prevUser,
                            roomNo: data.RoomNumber || "Loading...",
                            courseYear: data.CourseNameandYear || "Loading...",
                            mobile: data.Mobilenumber || "Loading...",
                            hostelName: data.CollegeName || "Loading...",
                            joinDate: data.StartingDate || "Loading...",
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching student details:', error);
            }

        }
        fetchStudentDetails();
    }, [user?.email]);

    // Mock Data with dynamic values for those we have
    const studentData = {
        roomNo: user?.roomNo || "Loading...",  // This still needs to be dynamic from DB if available later
        name: user?.name || "Loading...",
        email: user?.email || "Loading...",
        courseYear: user?.courseYear || "Loading..",
        mobile: user?.mobile || "Loading..",
        paymentStatus: "Paid",
        hostelName: "Srinidhi Boys Hostel",
        joinDate: user?.joinDate || "Loading...",
        role: user?.role || "Loading..."
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="student-dashboard">

            {/* 1. CUSTOM STICKY NAVBAR - Overriding any global fixed styles to ensure it takes up space */}
            <Navbar />



            {/* 2. MAIN CONTENT - Boxed sections with balanced margins */}
            <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 md:py-16 space-y-12 md:space-y-24 main-cont">

                {/* HEADER SECTION - Sharp, High Contrast */}
                <header className="sd-header">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center  w-full">
                            <div className="sd-hero w-full ">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck size={14} />
                                Verified Account
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                Welcome, <br />
                                <span className="text-indigo-600">{studentData.name}</span>
                            </h1>
                            <p className="text-slate-500 font-black text-xl uppercase tracking-tight border-l-8 border-slate-100 pl-6">
                                Managing your stay at <span className="text-slate-900">{studentData.hostelName}</span>
                            </p>
                        </div>
                        <div className="sd-stats">
                            <div className="sd-card">
                                <div className="value">{studentData.roomNo}</div>
                                <div className="label">Room No</div>
                            </div>
                            <div className="sd-card">
                                <div>
                                    <span className={`text-sm font-black px-3 py-1 inline-block ${studentData.paymentStatus === 'Paid' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'} uppercase tracking-widest rounded-full`}>
                                        {studentData.paymentStatus}
                                    </span>
                                </div>
                                <div className="label">Status</div>
                            </div>
                        </div>
                    </div>
                </header>
                <AddStudent />
                {/* DETAILS SECTION - Sharp Table with alternating colors */}
                <section className="sd-section">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-4">
                        <span className="bg-slate-900 text-white px-4 py-1">01</span>
                        Student Details
                    </h2>
                    <div className="sd-table">
                        <table>
                            <tbody>
                                {[
                                    { label: "Full Name", value: studentData.name },
                                    { label: "Email", value: studentData.email },
                                    { label: "Course & Year", value: studentData.courseYear },
                                    { label: "Mobile Number", value: studentData.mobile },
                                    { label: "Hostel Name", value: studentData.hostelName },
                                    { label: "Join Date", value: studentData.joinDate.slice(0,10) },
                                    { label: "Room Allotment", value: `${studentData.roomNo} (Bed A)` },
                                       { label: "Role", value: studentData.role}
                                
                                ].map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="key">{row.label}</td>
                                        <td className="val">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* QUICK ACTIONS - Sharp Grid with hover effects */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-4">
                        <span className="bg-slate-900 text-white px-4 py-1">02</span>
                        Quick Actions
                    </h2>

                    <div className="sd-quick-actions">
                        {[
                            { title: "Raise Complaint", desc: "Maintenance & Room issues", icon: <MessageSquare />, color: "bg-amber-400" },
                            { title: "Mess Menu", desc: "Weekly food schedule", icon: <Utensils />, color: "bg-blue-400" },
                            { title: "Payment History", desc: "Receipts & Transactions", icon: <CreditCard />, color: "bg-purple-400" }
                        ].map((action, idx) => (
                            <button key={idx} className="action-card" disabled>
                                <div className={`icon ${action.color} p-3`}>{action.icon}</div>
                                <div>
                                    <h4>{action.title}</h4>
                                    <p>{action.desc}</p>
                                    <p>coming soon..</p>
                                </div>
                                <div className="mt-auto flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest">
                                    Launch Tool <ArrowRight size={16} />
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* CONTACT & SUPPORT - Sharp Blocks */}


            </main>

            <LocationMap />

            <Footer />
        </div>
    );
};

export default StudentDashboard;