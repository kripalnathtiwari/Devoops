import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Home, Package, ShoppingCart, Users as UsersIcon, Settings, LogOut, Plus, Edit, Trash, CheckCircle, TrendingUp, DollarSign, Activity, MessageSquare, Grid, ShieldCheck, Mail, Phone, MapPin, Calendar, Star, Camera, Award, Smile } from 'lucide-react';

const API_URL = 'http://127.0.0.1:5050/api';

const MainLayout = ({ children, user, onLogout }) => (
  <div className="admin-layout">
    <aside className="sidebar">
      <div className="sidebar-logo">XStyle Admin</div>
      
      {/* Admin Profile Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 15px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', border: '3px solid #3b82f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {user?.profilePic ? (
                      <img 
                        src={user.profilePic.startsWith('http') ? user.profilePic : `http://127.0.0.1:5050${user.profilePic}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        alt="" 
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span style="font-weight: 800; font-size: 2rem; color: #3b82f6">${user?.name?.[0]?.toUpperCase() || 'A'}</span>`; }}
                      />
                  ) : (
                      <span style={{ fontWeight: '800', fontSize: '2rem', color: '#3b82f6' }}>{user?.name?.[0]?.toUpperCase() || 'A'}</span>
                  )}
              </div>
              <label htmlFor="admin-pic-upload" style={{ position: 'absolute', bottom: '0', right: '0', background: '#3b82f6', color: 'white', padding: '6px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <Camera size={14} />
                  <input 
                    type="file" 
                    id="admin-pic-upload" 
                    style={{ display: 'none' }} 
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('profilePic', file);
                        try {
                            const res = await axios.put('http://127.0.0.1:5050/api/auth/me', formData, {
                                headers: { 
                                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                                    'Content-Type': 'multipart/form-data'
                                }
                            });
                            alert('Profile updated!');
                            window.location.reload(); // Refresh to show new pic
                        } catch (err) {
                            alert('Upload failed: ' + (err.response?.data?.error || err.message));
                        }
                    }}
                  />
              </label>
          </div>
          <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>{user?.name}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{user?.role}</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Home size={18} /> Dashboard
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Package size={18} /> Products
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Grid size={18} /> Categories
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={18} /> Orders
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <UsersIcon size={18} /> Users
        </NavLink>
        <NavLink to="/reviews" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <MessageSquare size={18} /> Reviews
        </NavLink>
        <NavLink to="/free-gifts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Award size={18} /> Free Gifts
        </NavLink>
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <button className="nav-link" onClick={onLogout} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
    <main className="main-content">{children}</main>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0, reviews: 0 });
  const [chartData, setChartData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [topSelling, setTopSelling] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [p, o, u, r] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/orders/admin`, { headers }),
          axios.get(`${API_URL}/auth/users`, { headers }),
          axios.get(`${API_URL}/products/reviews`, { headers })
        ]);

        const deliveredOrders = o.data.filter(order => order.status === 'DELIVERED');
        const totalRevenue = deliveredOrders.reduce((acc, order) => acc + parseFloat(order.totalPrice), 0);
        
        console.log('Admin Stats Fetched:', { products: p.data.length, orders: o.data.length, users: u.data.length });
        setStats({ 
          products: p.data.length, 
          orders: o.data.length, 
          revenue: totalRevenue,
          users: u.data.length,
          reviews: r.data.length
        });
        
        // Generate Last 7 Days Chart Data
        const last7Days = Array.from({length: 7}).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        const dailyRevenue = last7Days.map(date => {
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const dayOrders = deliveredOrders.filter(order => new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateStr);
            const sum = dayOrders.reduce((acc, order) => acc + parseFloat(order.totalPrice), 0);
            return { name: dateStr, revenue: sum };
        });
        
        setChartData(dailyRevenue);

        // Generate Top 5 Products
        const productSales = {};
        o.data.forEach(order => {
           if (order.status === 'DELIVERED') {
               order.orderItems?.forEach(item => {
                   if (!productSales[item.productId]) {
                       const prodDetails = p.data.find(prod => prod.id === item.productId);
                       productSales[item.productId] = {
                           id: item.productId,
                           name: prodDetails?.name || item.product?.name || 'Unknown Product',
                           imageUrl: prodDetails?.imageUrl || item.product?.imageUrl || '',
                           price: prodDetails?.price || item.price || 0,
                           sales: 0,
                           revenue: 0
                       };
                   }
                   const qty = item.quantity || 1;
                   productSales[item.productId].sales += qty;
                   productSales[item.productId].revenue += (item.price || productSales[item.productId].price || 0) * qty;
               });
           }
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
        setTopSelling(topProducts);
      } catch (err) { console.error(err); }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 100);
  const points = chartData.map((d, i) => {
    const x = 50 + (i * 100);
    const y = 200 - ((d.revenue / maxRevenue) * 160);
    return { ...d, x, y };
  });

  const createCurve = (pts) => {
    if(!pts.length) return '';
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const cp1x = p1.x + 40;
        const cp1y = p1.y;
        const cp2x = p2.x - 40;
        const cp2y = p2.y;
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const linePath = points.length ? createCurve(points) : '';
  const areaPath = points.length ? `${linePath} L ${points[points.length-1].x},220 L ${points[0].x},220 Z` : '';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem', lineHeight: '1' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's your business performance.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden', gridColumn: 'span 2' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: '600', color: '#bfdbfe' }}>Total Revenue</p>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '12px' }}><DollarSign size={20} /></div>
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '900', letterSpacing: '-1px' }}>₹{stats.revenue.toLocaleString()}</h2>
            <p style={{ fontSize: '0.85rem', color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}><TrendingUp size={16}/> Business is active</p>
          </div>
          <div style={{ position: 'absolute', right: '-15px', bottom: '-25px', opacity: 0.15, transform: 'scale(4)' }}><DollarSign size={100} /></div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Total Orders</p>
            <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '12px', color: '#3b82f6', border: '1px solid #e2e8f0' }}><ShoppingCart size={20} /></div>
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0', color: '#0f172a', fontWeight: '900' }}>{stats.orders}</h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Products</p>
            <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '12px', color: '#8b5cf6', border: '1px solid #e2e8f0' }}><Package size={20} /></div>
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0', color: '#0f172a', fontWeight: '900' }}>{stats.products}</h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Total Users</p>
            <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '12px', color: '#10b981', border: '1px solid #e2e8f0' }}><UsersIcon size={20} /></div>
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0', color: '#0f172a', fontWeight: '900' }}>{stats.users}</h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Reviews</p>
            <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '12px', color: '#f59e0b', border: '1px solid #e2e8f0' }}><MessageSquare size={20} /></div>
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0', color: '#0f172a', fontWeight: '900' }}>{stats.reviews}</h2>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {chartData.length > 0 && (
          <div className="card" style={{ padding: '2rem', position: 'relative', overflow: 'visible' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>Revenue History</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', fontWeight: '500' }}>Performance over the last 7 days</p>
              </div>
            </div>

            <div style={{ width: '100%', height: '250px', position: 'relative' }}>
              <svg viewBox="0 0 700 250" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                {[40, 93, 146, 200].map(y => (
                  <line key={y} x1="50" y1={y} x2="650" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                ))}
                <path d={areaPath} fill="url(#gradientArea)" />
                <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeLinecap="round" />
                {points.map((pt, i) => (
                  <g key={i} onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)} style={{ cursor: 'pointer' }}>
                    <circle cx={pt.x} cy={pt.y} r="20" fill="transparent" />
                    <circle cx={pt.x} cy={pt.y} r={hoveredPoint?.name === pt.name ? "7" : "4"} fill="#fff" stroke={hoveredPoint?.name === pt.name ? "#8b5cf6" : "#2563eb"} strokeWidth="3" style={{ transition: 'all 0.2s', transformOrigin: `${pt.x}px ${pt.y}px` }} />
                  </g>
                ))}
                {points.map((pt, i) => (
                  <text key={i} x={pt.x} y="240" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">{pt.name}</text>
                ))}
              </svg>

              {hoveredPoint && (
                <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', transform: `translate(calc(${(hoveredPoint.x / 700) * 100}% - 65px), calc(${(hoveredPoint.y / 250) * 100}% - 75px))`, zIndex: 50 }}>
                  <div style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '14px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', minWidth: '130px', textAlign: 'center', border: '1px solid #1e293b' }}>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 'bold' }}>{hoveredPoint.name}</p>
                    <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '900' }}>₹{hoveredPoint.revenue.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginBottom: '0.5rem' }}>Top Trending Products</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Best performers by total sales</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topSelling.map((prod, idx) => (
              <div key={prod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={prod.imageUrl ? (prod.imageUrl.startsWith('http') ? prod.imageUrl : `${API_URL.replace('/api', '')}${prod.imageUrl}`) : ''} alt={prod.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{prod.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{prod.price}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '900', color: '#3b82f6', fontSize: '1rem' }}>{prod.sales} Sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/products/categories`);
            setCategories(res.data);
        } catch (err) { console.error(err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName) return;
        try {
            await axios.post(`${API_URL}/products/categories`, { name: newName }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setNewName('');
            fetchCategories();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category? Products in this category might be affected.')) return;
        try {
            await axios.delete(`${API_URL}/products/categories/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchCategories();
        } catch (err) { alert(err.message); }
    };

    useEffect(() => { fetchCategories(); }, []);

    return (
        <div>
            <div className="header">
                <h1>Product Categories</h1>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" placeholder="New category name..." className="btn" style={{ textAlign: 'left', minWidth: '250px' }} value={newName} onChange={e => setNewName(e.target.value)} required />
                    <button type="submit" className="btn btn-primary"><Plus size={18} /> Add</button>
                </form>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td>#{c.id}</td>
                                <td style={{ fontWeight: 'bold' }}>{c.name}</td>
                                <td>
                                    <button onClick={() => handleDelete(c.id)} style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const fetchUsers = async () => {
        try {
            setError(null);
            const res = await axios.get(`${API_URL}/auth/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            console.log('Users Data:', res.data);
            setUsers(res.data);
        } catch (err) { 
            console.error('Fetch Users Error:', err);
            setError(err.response?.data?.error || err.message);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders/admin`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setOrders(res.data);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            await axios.delete(`${API_URL}/auth/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchUsers();
        } catch (err) { alert(err.message); }
    };

    useEffect(() => { fetchUsers(); fetchOrders(); }, []);

    const getUserTotalSpent = (userId) => {
        return orders
            .filter(o => o.userId === userId && o.status === 'DELIVERED')
            .reduce((sum, o) => sum + parseFloat(o.totalPrice || 0), 0);
    };

    return (
        <div>
            <h1 className="header">User Management</h1>
            <div className="card" style={{ padding: 0 }}>
                {error && <div style={{ padding: '2rem', color: '#ff4d4d', textAlign: 'center', fontWeight: 'bold' }}>Error: {error}</div>}
                {!error && users.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No users found.</div>}
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Contact</th>
                            <th>Total Spent</th>
                            <th>Location</th>
                            <th>Joined</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => {
                            const totalSpent = getUserTotalSpent(u.id);
                            return (
                                <tr key={u.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>
                                                {u.name ? u.name[0].toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{u.name || 'Unknown'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: #{u.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={12}/> {u.email}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={12}/> {u.phone || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '800', color: totalSpent > 0 ? '#10b981' : '#64748b' }}>
                                            ₹{totalSpent.toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            <MapPin size={12}/> {u.city || 'N/A'}
                                        </div>
                                    </td>
                                <td>
                                    <div style={{ fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td>
                                    <span className="status-badge" style={{ background: u.role === 'ADMIN' ? '#fee2e2' : '#dcfce7', color: u.role === 'ADMIN' ? '#991b1b' : '#166534' }}>
                                        {u.role === 'ADMIN' ? <ShieldCheck size={14} style={{ marginRight: '4px' }} /> : null}
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    {u.role !== 'ADMIN' && (
                                        <button onClick={() => handleDelete(u.id)} style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash size={18}/></button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_URL}/products/reviews`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setReviews(res.data);
        } catch (err) { console.error(err); }
    };
    const handleDelete = async (id) => {
        if (!confirm('Delete this review?')) return;
        try {
            await axios.delete(`${API_URL}/products/reviews/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchReviews();
        } catch (err) { alert(err.message); }
    };
    useEffect(() => { fetchReviews(); }, []);

    return (
        <div>
            <h1 className="header">Product Reviews</h1>
            <div className="card" style={{ padding: 0 }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>User</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(r => (
                            <tr key={r.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={r.product?.imageUrl ? (r.product.imageUrl.startsWith('http') ? r.product.imageUrl : `${API_URL.replace('/api', '')}${r.product.imageUrl}`) : ''} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} alt="" />
                                        <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{r.product?.name}</div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{r.user?.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{r.user?.email}</div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />)}
                                    </div>
                                </td>
                                <td style={{ maxWidth: '300px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                                        {r.comment}
                                        {r.imageUrl && (
                                            <div style={{ marginTop: '5px' }}>
                                                <img src={r.imageUrl.startsWith('http') ? r.imageUrl : `${API_URL.replace('/api', '')}${r.imageUrl}`} style={{ width: '50px', borderRadius: '4px' }} alt="Review" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td><div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(r.createdAt).toLocaleDateString()}</div></td>
                                <td>
                                    <button onClick={() => handleDelete(r.id)} style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reviews.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No reviews found</div>}
            </div>
        </div>
    );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', categoryId: '', description: '', sizes: 'S,M,L,XL', colors: 'Black,White', stock: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [colorImages, setColorImages] = useState({});
  const [existingColorImages, setExistingColorImages] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/categories`);
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    try {
      await axios.post(`${API_URL}/products/categories`, { name: newCategoryName }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setNewCategoryName('');
      setShowNewCategory(false);
      fetchCategories();
    } catch (err) { alert(err.message); }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);

      Object.keys(colorImages).forEach(color => {
          if (colorImages[color]) {
              data.append(`colorImage_${color}`, colorImages[color]);
          }
      });
      data.append('existingColorImages', JSON.stringify(existingColorImages));

      if (editingProductId) {
        await axios.put(`${API_URL}/products/${editingProductId}`, data, { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          } 
        });
      } else {
        await axios.post(`${API_URL}/products`, data, { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          } 
        });
      }
      setIsModalOpen(false);
      setFormData({ name: '', price: '', categoryId: '', description: '', sizes: 'S,M,L,XL', colors: 'Black,White', stock: 0 });
      setImageFile(null);
      setColorImages({});
      setExistingColorImages({});
      setEditingProductId(null);
      fetchProducts();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (p) => {
      setEditingProductId(p.id);
      setFormData({
          name: p.name || '',
          price: p.price || '',
          categoryId: p.categoryId || '',
          stock: p.stock !== undefined ? p.stock : 0,
          description: p.description || '',
          sizes: p.sizes?.join(',') || '',
          colors: p.colors?.join(',') || ''
      });
      setImageFile(null);
      setColorImages({});
      setExistingColorImages(typeof p.colorImages === 'object' && p.colorImages ? p.colorImages : {});
      setIsModalOpen(true);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchProducts();
    } catch (err) { alert(err.message); }
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const getFullImgUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://127.0.0.1:5050${url}`;
  };

  return (
    <div>
      <div className="header">
        <h1>Product Catalog</h1>
        <button onClick={() => {
          setEditingProductId(null);
          setFormData({ name: '', price: '', categoryId: '', description: '', sizes: 'S,M,L,XL', colors: 'Black,White', stock: 0 });
          setImageFile(null);
          setColorImages({});
          setExistingColorImages({});
          setIsModalOpen(true);
        }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>{editingProductId ? 'Edit Product' : 'New Product'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Product Name" className="btn" style={{ textAlign: 'left' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select className="btn" style={{ flex: 1, textAlign: 'left' }} value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                    <option value="">Choose Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button type="button" onClick={() => setShowNewCategory(!showNewCategory)} className="btn btn-secondary" style={{ padding: '0 1rem' }} title="Add New Category">+</button>
              </div>

              {showNewCategory && (
                  <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.8rem', borderRadius: '12px' }}>
                      <input type="text" placeholder="Category Name" className="btn" style={{ flex: 1, textAlign: 'left', background: 'white' }} value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                      <button type="button" onClick={handleCreateCategory} className="btn btn-primary" style={{ padding: '0 1rem' }}>Add</button>
                  </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" placeholder="Price (₹)" className="btn" style={{ flex: 1, textAlign: 'left' }} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                <input type="number" placeholder="Stock" className="btn" style={{ flex: 1, textAlign: 'left' }} value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
              
              <div style={{ padding: '10px', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Upload Product Image{editingProductId && ' (Optional)'}</p>
                <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" { ...(!editingProductId ? { required: true } : {}) } />
              </div>

              <input type="text" placeholder="Sizes (e.g. S, M, L, XL)" className="btn" style={{ textAlign: 'left' }} value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} />
              <input type="text" placeholder="Colors (e.g. Black, White, Red)" className="btn" style={{ textAlign: 'left' }} value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} />
              
              {formData.colors.split(',').map(c => c.trim()).filter(Boolean).length > 0 && (
                <div style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-main)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Color-Specific Images (Optional)</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {formData.colors.split(',').map(c => c.trim()).filter(Boolean).map(color => (
                            <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '80px', fontWeight: 'bold' }}>{color}</span>
                                {existingColorImages[color] && (
                                    <img src={getFullImgUrl(existingColorImages[color])} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} alt={color} />
                                )}
                                <input type="file" onChange={e => setColorImages({...colorImages, [color]: e.target.files[0]})} accept="image/*" style={{ fontSize: '0.8rem' }} />
                                {existingColorImages[color] && (
                                    <button type="button" onClick={() => { const newExisting = {...existingColorImages}; delete newExisting[color]; setExistingColorImages(newExisting); }} style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
              )}

              <textarea placeholder="Product Description..." className="btn" style={{ textAlign: 'left', minHeight: '80px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
              
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '0.5rem' }}>{editingProductId ? 'Update Product' : 'Create Product'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Variants</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <a href={getFullImgUrl(p.imageUrl)} target="_blank" rel="noopener noreferrer">
                    <img src={getFullImgUrl(p.imageUrl)} alt={p.name} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }} />
                  </a>
                </td>
                <td><span style={{ fontWeight: '600' }}>{p.name}</span></td>
                <td><span className="status-badge" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>{p.category?.name}</span></td>
                <td>₹{p.price}</td>
                <td><span className="status-badge" style={{ background: (p.stock || 0) > 0 ? '#dcfce7' : '#fee2e2', color: (p.stock || 0) > 0 ? '#166534' : '#991b1b' }}>{(p.stock || 0) > 0 ? `${p.stock} in stock` : 'Out of stock'}</span></td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sizes: {p.sizes?.join(', ')}</div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {p.colors?.map(c => (
                            <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c.toLowerCase(), border: '1px solid #ddd' }} title={c} />
                        ))}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(p)} style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.5rem' }} title="Edit Product">
                      <Edit size={18}/>
                    </button>
                    <button onClick={() => deleteProduct(p.id)} style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '0.5rem' }} title="Delete Product">
                      <Trash size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await axios.get(`${API_URL}/orders/admin`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      console.log('Orders Data:', res.data);
      setOrders(res.data);
    } catch (err) { 
      console.error('Fetch Orders Error:', err);
      setError(err.response?.data?.error || err.message);
    }
  };
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/orders/admin/${id}`, { status }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchOrders();
    } catch (err) { alert(err.message); }
  };

  const groupedOrders = orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).reduce((groups, order) => {
    const dateOpts = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', dateOpts).toUpperCase().replace(/ /g, ' '); 
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(order);
    return groups;
  }, {});

  return (
    <div>
      <h1 className="header">Order Management</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#fff' }}>
        {error && <div style={{ padding: '2rem', color: '#ff4d4d', textAlign: 'center', fontWeight: 'bold' }}>Error: {error}</div>}
        {!error && orders.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No orders found.</div>}
        {Object.entries(groupedOrders).map(([dateStr, dateOrders]) => (
          <div key={dateStr} style={{ marginBottom: '1rem' }}>
            <div style={{ background: '#e2e8f0', padding: '0.75rem 1.5rem', color: '#475569', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
              <Calendar size={14} /> {dateStr}
            </div>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', margin: 0 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                   <th style={{ padding: '1rem 1.5rem', width: '120px' }}>ITEM ID</th>
                   <th style={{ width: '30%' }}>CUSTOMER INFO</th>
                   <th style={{ width: '30%' }}>PRODUCT DETAILS</th>
                   <th style={{ width: '15%' }}>STATUS & AMOUNT</th>
                   <th style={{ paddingRight: '1.5rem' }}>CONTROLS</th>
                </tr>
              </thead>
              <tbody>
                {dateOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.5rem' }}><span style={{ color: '#2563eb', fontWeight: 'bold' }}>#{o.id.toString().padStart(6, '0')}</span></td>
                    <td style={{ padding: '1.5rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{o.user?.name}</span>
                        <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 'bold' }}>UID: #{o.userId}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>📍 {o.address || o.user?.address || 'No Address Provided'}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>📞 {o.user?.phone || 'No Phone'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {o.orderItems?.map(item => (
                           <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={item.product?.imageUrl ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://127.0.0.1:5050${item.product.imageUrl}`) : ''} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }} alt={item.product?.name} />
                              <div>
                                 <p style={{ fontWeight: '600', fontSize: '0.85rem', color: '#0f172a' }}>{item.product?.name}</p>
                                 <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{item.quantity}</span></p>
                              </div>
                           </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                          <span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0f172a' }}>₹{o.totalPrice}</span>
                        </div>
                    </td>
                    <td style={{ padding: '1.5rem', paddingRight: '1.5rem' }}>
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={{ padding: '0.5rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.user.role !== 'ADMIN') return alert('Not Authorized');
      onLogin(res.data.user, res.data.token);
    } catch (err) { alert('Login Failed'); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
      <form onSubmit={handleSubmit} className="card" style={{ width: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Admin Portal</h2>
        <input type="email" placeholder="Email" className="btn" style={{ width: '100%', textAlign: 'left', marginBottom: '1rem' }} value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="btn" style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem' }} value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login Access</button>
      </form>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('adminUser')));
  const navigate = useNavigate();

  const handleLogin = (userData, token) => {
    localStorage.setItem('adminUser', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const isAuthError = error.response?.status === 401 || 
                          (error.response?.status === 400 && error.response?.data?.error === "Invalid token.");
        
        if (isAuthError) {
          localStorage.removeItem('adminUser');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  if (!user) return <Routes><Route path="/login" element={<Login onLogin={handleLogin} />} /><Route path="*" element={<Navigate to="/login" />} /></Routes>;

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/free-gifts" element={<FreeGifts />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </MainLayout>
  );
}

const FreeGifts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '0', categoryId: '', description: '', sizes: 'S,M,L,XL', colors: 'Black,White', stock: 100, isFreeGift: true });
  const [imageFile, setImageFile] = useState(null);
  const [colorImages, setColorImages] = useState({});
  const [existingColorImages, setExistingColorImages] = useState({});

  const fetchGifts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/free-gifts`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/categories`);
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    try {
      await axios.post(`${API_URL}/products/categories`, { name: newCategoryName }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setNewCategoryName('');
      setShowNewCategory(false);
      fetchCategories();
    } catch (err) { alert(err.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);

      Object.keys(colorImages).forEach(color => {
          if (colorImages[color]) {
              data.append(`colorImage_${color}`, colorImages[color]);
          }
      });
      data.append('existingColorImages', JSON.stringify(existingColorImages));
      
      const config = {
          headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
          }
      };

      if (editingProductId) {
        await axios.put(`${API_URL}/products/${editingProductId}`, data, config);
      } else {
        await axios.post(`${API_URL}/products`, data, config);
      }
      setIsModalOpen(false);
      setFormData({ name: '', price: '0', categoryId: '', description: '', sizes: 'S,M,L,XL', colors: 'Black,White', stock: 100, isFreeGift: true });
      setImageFile(null);
      setColorImages({});
      setExistingColorImages({});
      setEditingProductId(null);
      fetchGifts();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (p) => {
      setEditingProductId(p.id);
      setFormData({
          name: p.name || '',
          price: '0',
          categoryId: p.categoryId || '',
          stock: p.stock !== undefined ? p.stock : 0,
          description: p.description || '',
          sizes: p.sizes?.join(',') || '',
          colors: p.colors?.join(',') || '',
          isFreeGift: true
      });
      setImageFile(null);
      setColorImages({});
      setExistingColorImages(typeof p.colorImages === 'object' && p.colorImages ? p.colorImages : {});
      setIsModalOpen(true);
  };

  const deleteGift = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchGifts();
    } catch (err) { alert(err.message); }
  };

  useEffect(() => { fetchGifts(); fetchCategories(); }, []);

  const getFullImgUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://127.0.0.1:5050${url}`;
  };

  return (
    <div>
      <div className="header">
        <h1>Free Milestone Rewards</h1>
        <button onClick={() => {
          setEditingProductId(null);
          setFormData({ name: '', price: '0', categoryId: '', description: '', sizes: 'S,M,L,XL', colors: 'Black,White', stock: 100, isFreeGift: true });
          setImageFile(null);
          setColorImages({});
          setExistingColorImages({});
          setIsModalOpen(true);
        }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Reward
        </button>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>{editingProductId ? 'Edit Reward' : 'New Reward Product'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Product Name" className="btn" style={{ textAlign: 'left' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select className="btn" style={{ flex: 1, textAlign: 'left' }} value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                    <option value="">Choose Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button type="button" onClick={() => setShowNewCategory(!showNewCategory)} className="btn btn-secondary" style={{ padding: '0 1rem' }} title="Add New Category">+</button>
              </div>

              {showNewCategory && (
                  <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.8rem', borderRadius: '12px' }}>
                      <input type="text" placeholder="Category Name" className="btn" style={{ flex: 1, textAlign: 'left', background: 'white' }} value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                      <button type="button" onClick={handleCreateCategory} className="btn btn-primary" style={{ padding: '0 1rem' }}>Add</button>
                  </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" placeholder="Price (₹) - Forced Free" disabled className="btn" style={{ flex: 1, textAlign: 'left', opacity: 0.6 }} value="0" />
                <input type="number" placeholder="Stock" className="btn" style={{ flex: 1, textAlign: 'left' }} value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
              </div>
              
              <div style={{ padding: '10px', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Upload Reward Image{editingProductId && ' (Optional)'}</p>
                <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" { ...(!editingProductId ? { required: true } : {}) } />
              </div>

              <input type="text" placeholder="Sizes (e.g. S, M, L, XL)" className="btn" style={{ textAlign: 'left' }} value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} />
              <input type="text" placeholder="Colors (e.g. Black, White, Red)" className="btn" style={{ textAlign: 'left' }} value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} />
              
              {formData.colors.split(',').map(c => c.trim()).filter(Boolean).length > 0 && (
                <div style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-main)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Color-Specific Images (Optional)</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {formData.colors.split(',').map(c => c.trim()).filter(Boolean).map(color => (
                            <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '80px', fontWeight: 'bold' }}>{color}</span>
                                {existingColorImages[color] && (
                                    <img src={getFullImgUrl(existingColorImages[color])} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} alt={color} />
                                )}
                                <input type="file" onChange={e => setColorImages({...colorImages, [color]: e.target.files[0]})} accept="image/*" style={{ fontSize: '0.8rem' }} />
                                {existingColorImages[color] && (
                                    <button type="button" onClick={() => { const newExisting = {...existingColorImages}; delete newExisting[color]; setExistingColorImages(newExisting); }} style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
              )}

              <textarea placeholder="Reward Description..." className="btn" style={{ textAlign: 'left', minHeight: '80px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
              
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '0.5rem' }}>{editingProductId ? 'Update Reward' : 'Create Reward Product'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Variants</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <a href={getFullImgUrl(p.imageUrl)} target="_blank" rel="noopener noreferrer">
                    <img src={getFullImgUrl(p.imageUrl)} alt={p.name} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }} />
                  </a>
                </td>
                <td><span style={{ fontWeight: '600' }}>{p.name}</span></td>
                <td><span className="status-badge" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>{p.category?.name}</span></td>
                <td><span style={{ color: '#10b981', fontWeight: 'bold' }}>FREE</span></td>
                <td><span className="status-badge" style={{ background: (p.stock || 0) > 0 ? '#dcfce7' : '#fee2e2', color: (p.stock || 0) > 0 ? '#166534' : '#991b1b' }}>{(p.stock || 0) > 0 ? `${p.stock} in stock` : 'Out of stock'}</span></td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sizes: {p.sizes?.join(', ')}</div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {p.colors?.map(c => (
                            <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c.toLowerCase(), border: '1px solid #ddd' }} title={c} />
                        ))}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(p)} style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.5rem' }} title="Edit Reward">
                      <Edit size={18}/>
                    </button>
                    <button onClick={() => deleteGift(p.id)} style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '0.5rem' }} title="Delete Reward">
                      <Trash size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No free rewards currently listed.</div>}
      </div>
    </div>
  );
};
