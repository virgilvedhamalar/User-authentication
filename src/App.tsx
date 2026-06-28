import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  BookOpen, 
  Phone, 
  Mail, 
  Layers, 
  X, 
  Check, 
  AlertTriangle, 
  GraduationCap, 
  Server, 
  Activity,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define the Student interface matching the backend schema
interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  email: string;
  phone: string;
}

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error';
}

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  // Form input states
  const [formId, setFormId] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formDept, setFormDept] = useState<string>('');
  const [formYear, setFormYear] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');

  // Toast dispatch
  const addToast = (text: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/students');
      if (!res.ok) throw new Error(`Status code ${res.status}`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load students. Backend server might be starting up or offline.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search and selected department
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = deptFilter === '' || student.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [students, searchTerm, deptFilter]);

  // Compute stats
  const stats = useMemo(() => {
    const departments = new Set(students.map(s => s.department));
    return {
      total: students.length,
      departmentsCount: departments.size
    };
  }, [students]);

  // Open creation modal
  const handleOpenCreate = () => {
    setModalAction('create');
    setFormId('');
    setFormName('');
    setFormDept('');
    setFormYear('');
    setFormEmail('');
    setFormPhone('');
    setIsFormModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (student: Student) => {
    setModalAction('edit');
    setFormId(student.id);
    setFormName(student.name);
    setFormDept(student.department);
    setFormYear(student.year);
    setFormEmail(student.email);
    setFormPhone(student.phone);
    setIsFormModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formId || !formName || !formDept || !formYear || !formEmail || !formPhone) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    const payload = {
      id: formId,
      name: formName,
      department: formDept,
      year: formYear,
      email: formEmail,
      phone: formPhone
    };

    try {
      let res;
      if (modalAction === 'create') {
        res = await fetch('/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/students/${formId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      
      if (res.ok) {
        addToast(data.message || 'Action completed successfully!', 'success');
        setIsFormModalOpen(false);
        fetchStudents();
      } else {
        addToast(data.message || 'Operation failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Connection error: Please try again later.', 'error');
    }
  };

  // Handle deletion
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/students/${deleteTarget.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        addToast(data.message || 'Record deleted successfully.', 'success');
        setDeleteTarget(null);
        fetchStudents();
      } else {
        addToast(data.message || 'Failed to delete record.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete student.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-accent selection:text-brand-bg">
      
      {/* Navbar Banner */}
      <header className="sticky top-0 z-40 h-[70px] bg-brand-surface border-b border-brand-line">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-brand-bg shadow-md shadow-brand-accent/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif italic font-semibold text-xl text-brand-accent tracking-wider">Lyceum Systems</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-brand-bg text-brand-muted border border-brand-line rounded-md">V1.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-bg text-emerald-400 border border-brand-line">
              <Server className="w-3.5 h-3.5" />
              <span>API Live</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif italic font-semibold text-3xl sm:text-4xl text-brand-accent tracking-wide">
              Active Directory
            </h1>
            <p className="text-brand-muted mt-2 text-sm sm:text-base max-w-2xl">
              Managing student enrollment and academic profiles.
            </p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-accent hover:opacity-90 text-brand-bg font-semibold text-sm transition-all shadow-md shadow-brand-accent/10 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Student</span>
          </button>
        </section>

        {/* Dashboard Statistics Panels */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-brand-surface border border-brand-line rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-brand-muted">Total Enrolled</p>
              <h3 className="text-3xl font-serif italic font-bold text-brand-accent mt-2">{loading ? '...' : stats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-bg text-brand-accent border border-brand-line flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-line rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-brand-muted">Departments</p>
              <h3 className="text-3xl font-serif italic font-bold text-brand-accent mt-2">{loading ? '...' : stats.departmentsCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-bg text-brand-accent border border-brand-line flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-line rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-brand-muted">Database Status</p>
              <h3 className="text-base font-bold text-[#2dd4bf] mt-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse"></span>
                Synced (JSON)
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-bg text-[#2dd4bf] border border-brand-line flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Central Data Workspace */}
        <section className="bg-brand-surface border border-brand-line rounded-2xl shadow-lg overflow-hidden flex flex-col">
          
          {/* Controls: Search and Filters */}
          <div className="p-6 border-b border-brand-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface/40">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted w-4.5 h-4.5 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search by ID, student name, department or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-brand-bg border border-brand-line focus:border-brand-accent rounded-xl text-sm focus:outline-none transition-all placeholder:text-brand-muted text-brand-text focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-brand-muted" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-4 py-2.5 bg-brand-bg border border-brand-line focus:border-brand-accent rounded-xl text-sm focus:outline-none transition-all cursor-pointer text-brand-muted focus:ring-1 focus:ring-brand-accent"
              >
                <option value="">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
          </div>

          {/* Loading States */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-brand-line border-t-brand-accent rounded-full animate-spin"></div>
              <p className="text-sm text-brand-muted font-medium">Retrieving student records...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4 px-6">
              <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center text-brand-muted">
                <BookOpen className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-semibold text-brand-text text-base">No students found</h4>
                <p className="text-sm text-brand-muted mt-1 max-w-sm">
                  We couldn't find any entries matching your query. Register a student or tweak your filters to continue.
                </p>
              </div>
              {(searchTerm || deptFilter) && (
                <button 
                  onClick={() => { setSearchTerm(''); setDeptFilter(''); }}
                  className="mt-2 text-xs font-semibold text-brand-accent hover:underline cursor-pointer underline-offset-4"
                >
                  Clear all search filters
                </button>
              )}
            </div>
          ) : (
            /* Responsive Student Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-surface/80 text-brand-accent font-serif italic text-xs tracking-wider border-b border-brand-line">
                    <th className="px-6 py-4 font-normal">Student ID</th>
                    <th className="px-6 py-4 font-normal">Full Name</th>
                    <th className="px-6 py-4 font-normal">Department</th>
                    <th className="px-6 py-4 font-normal">Academic Year</th>
                    <th className="px-6 py-4 font-normal">Email</th>
                    <th className="px-6 py-4 font-normal">Phone Number</th>
                    <th className="px-6 py-4 text-right font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line text-sm text-brand-text">
                  {filteredStudents.map((student) => {
                    // Sophisticated department badges
                    let badgeClass = "bg-brand-bg text-brand-muted border border-brand-line";
                    if (student.department === 'Computer Science') badgeClass = "bg-indigo-950/40 text-indigo-300 border border-indigo-900/40";
                    else if (student.department === 'Information Technology') badgeClass = "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40";
                    else if (student.department === 'Electrical Engineering') badgeClass = "bg-amber-950/40 text-amber-300 border border-amber-900/40";
                    else if (student.department === 'Mechanical Engineering') badgeClass = "bg-pink-950/40 text-pink-300 border border-pink-900/40";
                    else if (student.department === 'Civil Engineering') badgeClass = "bg-teal-950/40 text-teal-300 border border-teal-100/40";

                    return (
                      <tr key={student.id} className="hover:bg-brand-accent/[0.04] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-brand-muted">{student.id}</td>
                        <td className="px-6 py-4 font-semibold text-brand-text">{student.name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${badgeClass}`}>
                            {student.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-bg text-brand-text border border-brand-line">
                            {student.year}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-brand-muted flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-brand-muted" />
                          <span>{student.email}</span>
                        </td>
                        <td className="px-6 py-4 text-brand-muted whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-brand-muted" />
                            <span>{student.phone}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button 
                              onClick={() => handleOpenEdit(student)}
                              className="p-1.5 rounded-lg bg-brand-bg border border-brand-line hover:border-brand-accent hover:text-brand-accent text-brand-text transition-colors cursor-pointer"
                              title="Edit record"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeleteTarget(student)}
                              className="p-1.5 rounded-lg bg-brand-bg border border-brand-line hover:border-red-500 hover:text-red-400 text-brand-text transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Form Dialog Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
            />

            {/* Modal Body Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-brand-surface border border-brand-line rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-brand-line flex items-center justify-between">
                <h2 className="font-serif italic text-lg text-brand-accent">
                  {modalAction === 'create' ? 'Register New Student' : 'Edit Student Details'}
                </h2>
                <button 
                  onClick={() => setIsFormModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-brand-bg text-brand-muted hover:text-brand-accent flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                      Student ID <span className="text-brand-accent">*</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. STU101"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      disabled={modalAction === 'edit'}
                      required
                      className="px-4 py-2.5 bg-brand-bg border border-brand-line focus:border-brand-accent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-brand-text disabled:opacity-50 disabled:text-brand-muted"
                    />
                    {modalAction === 'create' && (
                      <p className="text-[11px] text-brand-muted">Unique identifier code that cannot be altered later.</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                      Full Name <span className="text-brand-accent">*</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Jane Smith"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="px-4 py-2.5 bg-brand-bg border border-brand-line focus:border-brand-accent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-brand-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                      Department <span className="text-brand-accent">*</span>
                    </label>
                    <select
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                      required
                      className="px-4 py-2.5 bg-brand-bg border border-brand-line focus:border-brand-accent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all cursor-pointer text-brand-text"
                    >
                      <option value="" disabled className="bg-brand-surface text-brand-muted">Select Department</option>
                      <option value="Computer Science" className="bg-brand-surface text-brand-text">Computer Science</option>
                      <option value="Information Technology" className="bg-brand-surface text-brand-text">Information Technology</option>
                      <option value="Electrical Engineering" className="bg-brand-surface text-brand-text">Electrical Engineering</option>
                      <option value="Mechanical Engineering" className="bg-brand-surface text-brand-text">Mechanical Engineering</option>
                      <option value="Civil Engineering" className="bg-brand-surface text-brand-text">Civil Engineering</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                      Academic Year <span className="text-brand-accent">*</span>
                    </label>
                    <select
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      required
                      className="px-4 py-2.5 bg-brand-bg border border-brand-line focus:border-brand-accent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all cursor-pointer text-brand-text"
                    >
                      <option value="" disabled className="bg-brand-surface text-brand-muted">Select Year</option>
                      <option value="1st Year" className="bg-brand-surface text-brand-text">1st Year (Freshman)</option>
                      <option value="2nd Year" className="bg-brand-surface text-brand-text">2nd Year (Sophomore)</option>
                      <option value="3rd Year" className="bg-brand-surface text-brand-text">3rd Year (Junior)</option>
                      <option value="4th Year" className="bg-brand-surface text-brand-text">4th Year (Senior)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                      Email Address <span className="text-brand-accent">*</span>
                    </label>
                    <input 
                      type="email"
                      placeholder="e.g. jane.smith@school.edu"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                      className="px-4 py-2.5 bg-brand-bg border border-brand-line focus:border-brand-accent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-brand-text"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                      Phone Number <span className="text-brand-accent">*</span>
                    </label>
                    <input 
                      type="tel"
                      placeholder="e.g. +1 (555) 012-3456"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      required
                      className="px-4 py-2.5 bg-brand-bg border border-brand-line focus:border-brand-accent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-brand-text"
                    />
                  </div>
                </div>

                <div className="p-6 bg-brand-bg -mx-6 -mb-6 flex justify-end gap-3 border-t border-brand-line">
                  <button 
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-brand-line hover:bg-brand-surface text-brand-muted hover:text-brand-text font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent hover:opacity-90 text-brand-bg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{modalAction === 'create' ? 'Register Student' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-brand-surface border border-brand-line rounded-2xl shadow-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-950/30 text-red-400 border border-red-900/40 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif italic text-lg text-brand-accent">Delete Student Record?</h3>
              <p className="text-sm text-brand-muted mt-2">
                Are you absolutely sure you want to delete the record for <strong className="text-brand-text">{deleteTarget.name}</strong> (ID: {deleteTarget.id})? This is irreversible.
              </p>
              
              <div className="flex gap-3 justify-center mt-6">
                <button 
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2.5 rounded-xl border border-brand-line hover:bg-brand-bg text-brand-muted hover:text-brand-text font-semibold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  Yes, Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div 
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl shadow-lg border bg-brand-surface border-brand-line flex items-center gap-3 min-w-[300px] border-l-4 ${
                toast.type === 'success' ? 'border-l-emerald-500' : 'border-l-red-500'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="text-xs font-semibold text-brand-text">{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
