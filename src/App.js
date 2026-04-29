import React from "react";
import { useState, useEffect, useRef } from "react";

const ADMIN_PASSWORD = "mayank@admin";

const defaultData = {
  about: {
    name: "Mayank Kohale",
    title: "DevOps Intern",
    bio: "Passionate about building scalable infrastructure and automating everything. I thrive in cloud environments and love bridging the gap between development and operations.",
    github: "https://github.com/mayankkohale",
    linkedin: "https://linkedin.com/in/mayankkohale",
    email: "kohalemayank@gmail.com",
  },
  skills: [
    { id: 1, name: "Docker", level: 80, category: "Containers" },
    { id: 2, name: "Kubernetes", level: 65, category: "Orchestration" },
    { id: 3, name: "CI/CD (Jenkins)", level: 75, category: "Automation" },
    { id: 4, name: "AWS", level: 70, category: "Cloud" },
    { id: 5, name: "Linux", level: 85, category: "OS" },
    { id: 6, name: "Terraform", level: 60, category: "IaC" },
    { id: 7, name: "Git", level: 90, category: "Version Control" },
    { id: 8, name: "Python", level: 72, category: "Scripting" },
  ],
  projects: [
    {
      id: 1,
      title: "CI/CD Pipeline Automation",
      description: "Built a complete CI/CD pipeline using Jenkins, Docker, and GitHub Actions to automate testing and deployment of microservices.",
      tech: ["Jenkins", "Docker", "GitHub Actions"],
      link: "#",
    },
    {
      id: 2,
      title: "Kubernetes Cluster Setup",
      description: "Deployed and managed a production-grade Kubernetes cluster on AWS EKS with auto-scaling and monitoring via Prometheus.",
      tech: ["Kubernetes", "AWS EKS", "Prometheus"],
      link: "#",
    },
  ],
  certifications: [
    {
      id: 1,
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2024",
      credentialId: "AWS-CCP-12345",
      link: "#",
    },
    {
      id: 2,
      name: "Docker Certified Associate",
      issuer: "Docker Inc.",
      date: "2024",
      credentialId: "DCA-67890",
      link: "#",
    },
  ],
  experience: [
    {
      id: 1,
      role: "DevOps Intern",
      company: "Tech Solutions Pvt. Ltd.",
      period: "Jan 2024 – Present",
      description: "Working on CI/CD pipelines, container orchestration, and cloud infrastructure automation.",
    },
  ],
  education: [
    {
      id: 1,
      degree: "B.Tech in Computer Science",
      institution: "XYZ University",
      period: "2021 – 2025",
      grade: "8.5 CGPA",
    },
  ],
};

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
  }}>
    <div style={{
      background: "rgba(10,20,40,0.97)", border: "1px solid rgba(0,212,255,0.3)",
      borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "520px",
      boxShadow: "0 0 40px rgba(0,212,255,0.15)", maxHeight: "80vh", overflowY: "auto"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ color: "#00d4ff", fontFamily: "'Orbitron', monospace", fontSize: "0.9rem", margin: 0, letterSpacing: "0.1em" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "1.5rem", lineHeight: 1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const inputStyle = {
  width: "100%", background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)",
  borderRadius: "8px", padding: "10px 14px", color: "#e0f0ff", fontFamily: "'Exo 2', sans-serif",
  fontSize: "0.9rem", outline: "none", marginBottom: "12px", boxSizing: "border-box",
};

const btnStyle = (color = "#00d4ff") => ({
  background: `rgba(${color === "#00d4ff" ? "0,212,255" : color === "#7c3aed" ? "124,58,237" : "255,60,120"},0.1)`,
  border: `1px solid ${color}`, color, borderRadius: "8px", padding: "8px 18px",
  cursor: "pointer", fontFamily: "'Orbitron', monospace", fontSize: "0.72rem",
  transition: "all 0.2s", letterSpacing: "0.05em"
});

export default function Portfolio() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("mk_portfolio_data");
      return saved ? JSON.parse(saved) : defaultData;
    } catch { return defaultData; }
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [editAbout, setEditAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState(data.about);

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 8
  }));

  const sections = ["home", "about", "skills", "projects", "certifications", "experience", "education", "contact"];

  useEffect(() => {
    try { localStorage.setItem("mk_portfolio_data", JSON.stringify(data)); } catch {}
  }, [data]);

  const save = (section, items) => setData(d => ({ ...d, [section]: items }));

  const handleLogin = () => {
    if (loginInput === ADMIN_PASSWORD) {
      setIsAdmin(true); setShowLogin(false); setLoginInput(""); setLoginError("");
    } else { setLoginError("Incorrect password. Try again."); }
  };

  const openAdd = (section) => { setFormData({}); setModal({ type: "add", section }); };
  const openEdit = (section, item) => { setFormData({ ...item }); setModal({ type: "edit", section, item }); };
  const closeModal = () => { setModal(null); setFormData({}); };

  const handleSave = () => {
    const { type, section, item } = modal;
    if (type === "add") {
      save(section, [...data[section], { ...formData, id: Date.now() }]);
    } else {
      save(section, data[section].map(i => i.id === item.id ? { ...formData, id: item.id } : i));
    }
    closeModal();
  };

  const handleDelete = (section, id) => {
    if (window.confirm("Delete this item?")) save(section, data[section].filter(i => i.id !== id));
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  const techColors = ["#00d4ff", "#7c3aed", "#ff3c78", "#00ff88", "#ffd700"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#020810; color:#e0f0ff; font-family:'Exo 2',sans-serif; overflow-x:hidden; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#020810; } ::-webkit-scrollbar-thumb { background:#00d4ff; border-radius:2px; }
        .glass { background:rgba(255,255,255,0.03); backdrop-filter:blur(20px); border:1px solid rgba(0,212,255,0.12); border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05); }
        .sec-title { font-family:'Orbitron',monospace; font-size:clamp(1.2rem,3vw,1.8rem); color:#00d4ff; letter-spacing:0.15em; text-transform:uppercase; text-shadow:0 0 30px rgba(0,212,255,0.6); margin-bottom:36px; }
        .nav-btn { background:none; border:none; color:#88aacc; cursor:pointer; font-family:'Orbitron',monospace; font-size:0.6rem; letter-spacing:0.1em; text-transform:uppercase; padding:7px 12px; border-radius:6px; transition:all 0.2s; }
        .nav-btn:hover,.nav-btn.active { color:#00d4ff; background:rgba(0,212,255,0.08); text-shadow:0 0 8px rgba(0,212,255,0.5); }
        .skill-bar { height:4px; background:rgba(255,255,255,0.08); border-radius:2px; overflow:hidden; margin-top:8px; }
        .skill-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,#00d4ff,#7c3aed); box-shadow:0 0 8px rgba(0,212,255,0.5); }
        .tag { display:inline-block; padding:3px 10px; border-radius:20px; font-size:0.68rem; border:1px solid; margin:2px; }
        .fab { position:fixed; bottom:24px; right:24px; z-index:900; background:rgba(0,212,255,0.1); border:1px solid rgba(0,212,255,0.3); color:#00d4ff; border-radius:50%; width:48px; height:48px; cursor:pointer; font-size:1.1rem; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(0,212,255,0.2); transition:all 0.2s; }
        .fab:hover { background:rgba(0,212,255,0.2); box-shadow:0 0 30px rgba(0,212,255,0.4); }
        .add-btn { display:flex; align-items:center; gap:6px; background:rgba(0,212,255,0.05); border:1px dashed rgba(0,212,255,0.25); border-radius:10px; padding:10px 18px; color:#00d4ff; cursor:pointer; font-family:'Orbitron',monospace; font-size:0.68rem; letter-spacing:0.08em; transition:all 0.2s; margin-top:16px; }
        .add-btn:hover { background:rgba(0,212,255,0.1); border-color:rgba(0,212,255,0.5); }
        .card-wrap { position:relative; }
        .edit-actions { position:absolute; top:8px; right:8px; display:flex; gap:6px; opacity:0; transition:opacity 0.2s; }
        .card-wrap:hover .edit-actions { opacity:1; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
        .float { animation:float 6s ease-in-out infinite; }
        .grid-bg { background-image:linear-gradient(rgba(0,212,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.025) 1px,transparent 1px); background-size:60px 60px; }
        input:focus,textarea:focus { border-color:rgba(0,212,255,0.5)!important; }
        textarea { resize:vertical; }
        a { transition:all 0.2s; }
      `}</style>

      {/* BG */}
      <div className="grid-bg" style={{ position:"fixed", inset:0, zIndex:0 }} />
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {particles.map(p => (
          <div key={p.id} style={{ position:"absolute", left:`${p.x}%`, top:`${p.y}%`, width:`${p.size}px`, height:`${p.size}px`, borderRadius:"50%", background:"#00d4ff", animation:`pulse ${3+p.delay/2}s ease-in-out infinite`, animationDelay:`${p.delay}s`, opacity:0.3 }} />
        ))}
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"60vw", height:"60vw", borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"50vw", height:"50vw", borderRadius:"50%", background:"radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
      </div>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:800, background:"rgba(2,8,16,0.88)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,212,255,0.1)", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"58px" }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:"1rem", color:"#00d4ff", letterSpacing:"0.05em" }}>
          MK<span style={{ color:"#7c3aed" }}>.dev</span>
        </div>
        <div style={{ display:"flex", gap:"2px", flexWrap:"wrap", justifyContent:"flex-end" }}>
          {sections.map(s => (
            <button key={s} className={`nav-btn ${activeSection===s?"active":""}`} onClick={() => scrollTo(s)}>{s}</button>
          ))}
        </div>
        {isAdmin && <button onClick={() => setIsAdmin(false)} style={{ ...btnStyle("#ff3c78"), marginLeft:"12px" }}>LOGOUT</button>}
      </nav>

      <main style={{ paddingTop:"58px", position:"relative", zIndex:1 }}>

        {/* HERO */}
        <section id="home" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
          <div className="float" style={{ textAlign:"center", maxWidth:"700px" }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:"0.75rem", color:"#7c3aed", letterSpacing:"0.3em", marginBottom:"20px", opacity:0.9 }}>
              &lt; WELCOME TO MY PORTFOLIO /&gt;
            </div>
            <h1 style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:"clamp(2.8rem,8vw,5.5rem)", lineHeight:1.05, textShadow:"0 0 30px rgba(0,212,255,0.7),0 0 60px rgba(0,212,255,0.3)" }}>
              MAYANK
            </h1>
            <h1 style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:"clamp(2.8rem,8vw,5.5rem)", lineHeight:1.05, color:"#7c3aed", textShadow:"0 0 30px rgba(124,58,237,0.7)", marginBottom:"20px" }}>
              KOHALE
            </h1>
            <div style={{ margin:"0 auto 20px", width:"100px", height:"2px", background:"linear-gradient(90deg,transparent,#00d4ff,transparent)" }} />
            <p style={{ color:"#88aacc", fontSize:"1rem", letterSpacing:"0.2em", fontFamily:"'Orbitron',monospace", marginBottom:"10px" }}>
              {data.about.title.toUpperCase()}
            </p>
            <p style={{ color:"#445566", fontSize:"0.9rem", maxWidth:"480px", margin:"0 auto 36px", lineHeight:1.8 }}>
              {data.about.bio}
            </p>
            <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={() => scrollTo("projects")} style={{ ...btnStyle("#00d4ff"), padding:"12px 28px", fontSize:"0.78rem" }}>
                VIEW PROJECTS
              </button>
              <button onClick={() => scrollTo("contact")} style={{ ...btnStyle("#7c3aed"), padding:"12px 28px", fontSize:"0.78rem" }}>
                CONTACT ME
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding:"80px 24px", maxWidth:"900px", margin:"0 auto" }}>
          <div className="sec-title">// ABOUT ME</div>
          <div className="glass" style={{ padding:"40px", position:"relative" }}>
            {isAdmin && !editAbout && (
              <button onClick={() => { setAboutDraft(data.about); setEditAbout(true); }} style={{ ...btnStyle("#00d4ff"), position:"absolute", top:16, right:16 }}>
                ✏️ EDIT
              </button>
            )}
            {editAbout ? (
              <div>
                {[["name","Name"],["title","Title"],["bio","Bio"],["github","GitHub URL"],["linkedin","LinkedIn URL"],["email","Email"]].map(([k, label]) => (
                  <div key={k}>
                    <label style={{ color:"#556677", fontSize:"0.72rem", display:"block", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</label>
                    {k==="bio" ? (
                      <textarea rows={3} style={inputStyle} value={aboutDraft[k]||""} onChange={e => setAboutDraft(d => ({...d,[k]:e.target.value}))} />
                    ) : (
                      <input style={inputStyle} value={aboutDraft[k]||""} onChange={e => setAboutDraft(d => ({...d,[k]:e.target.value}))} />
                    )}
                  </div>
                ))}
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={() => { setData(d=>({...d,about:aboutDraft})); setEditAbout(false); }} style={btnStyle("#00d4ff")}>SAVE</button>
                  <button onClick={() => setEditAbout(false)} style={btnStyle("#ff3c78")}>CANCEL</button>
                </div>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"40px", alignItems:"center" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ width:"130px", height:"130px", borderRadius:"50%", background:"linear-gradient(135deg,rgba(0,212,255,0.15),rgba(124,58,237,0.15))", border:"2px solid rgba(0,212,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3.2rem", boxShadow:"0 0 30px rgba(0,212,255,0.15)", marginBottom:"12px" }}>👨‍💻</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", color:"#00d4ff", fontSize:"0.8rem" }}>{data.about.name}</div>
                  <div style={{ color:"#7c3aed", fontSize:"0.75rem", marginTop:"4px" }}>{data.about.title}</div>
                </div>
                <div>
                  <p style={{ color:"#aac0d8", lineHeight:1.85, marginBottom:"24px", fontSize:"0.95rem" }}>{data.about.bio}</p>
                  <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                    {[["⬡ GitHub", data.about.github,"#00d4ff"],["◈ LinkedIn",data.about.linkedin,"#7c3aed"],["✉ Email",`mailto:${data.about.email}`,"#ff3c78"]].map(([label,href,color]) => (
                      <a key={label} href={href} target="_blank" rel="noreferrer" style={{ ...btnStyle(color), textDecoration:"none" }}>{label} ↗</a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ padding:"80px 24px", maxWidth:"900px", margin:"0 auto" }}>
          <div className="sec-title">// SKILLS</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"14px" }}>
            {data.skills.map(skill => (
              <div key={skill.id} className="card-wrap">
                <div className="glass" style={{ padding:"20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ color:"#e0f0ff", fontWeight:600 }}>{skill.name}</div>
                      <div style={{ color:"#556677", fontSize:"0.72rem", marginTop:"2px", letterSpacing:"0.08em" }}>{skill.category}</div>
                    </div>
                    <span style={{ fontFamily:"'Orbitron',monospace", color:"#00d4ff", fontSize:"0.8rem" }}>{skill.level}%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width:`${skill.level}%` }} /></div>
                </div>
                {isAdmin && (
                  <div className="edit-actions">
                    <button onClick={() => openEdit("skills",skill)} style={{ ...btnStyle("#00d4ff"), padding:"4px 10px", fontSize:"0.62rem" }}>✏️</button>
                    <button onClick={() => handleDelete("skills",skill.id)} style={{ ...btnStyle("#ff3c78"), padding:"4px 10px", fontSize:"0.62rem" }}>🗑</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && <button className="add-btn" onClick={() => openAdd("skills")}>＋ ADD SKILL</button>}
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ padding:"80px 24px", maxWidth:"900px", margin:"0 auto" }}>
          <div className="sec-title">// PROJECTS</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:"18px" }}>
            {data.projects.map(p => (
              <div key={p.id} className="card-wrap">
                <div className="glass" style={{ padding:"28px", height:"100%" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <h3 style={{ color:"#00d4ff", fontFamily:"'Orbitron',monospace", fontSize:"0.85rem", lineHeight:1.4 }}>{p.title}</h3>
                    <a href={p.link} target="_blank" rel="noreferrer" style={{ color:"#7c3aed", textDecoration:"none", fontSize:"1.1rem", marginLeft:"8px", flexShrink:0 }}>↗</a>
                  </div>
                  <p style={{ color:"#88aacc", fontSize:"0.87rem", lineHeight:1.75, marginBottom:"16px" }}>{p.description}</p>
                  <div>{(p.tech||[]).map((t,i) => <span key={t} className="tag" style={{ borderColor:techColors[i%5], color:techColors[i%5] }}>{t}</span>)}</div>
                </div>
                {isAdmin && (
                  <div className="edit-actions">
                    <button onClick={() => openEdit("projects",p)} style={{ ...btnStyle("#00d4ff"), padding:"4px 10px", fontSize:"0.62rem" }}>✏️</button>
                    <button onClick={() => handleDelete("projects",p.id)} style={{ ...btnStyle("#ff3c78"), padding:"4px 10px", fontSize:"0.62rem" }}>🗑</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && <button className="add-btn" onClick={() => openAdd("projects")}>＋ ADD PROJECT</button>}
        </section>

        {/* CERTIFICATIONS */}
        <section id="certifications" style={{ padding:"80px 24px", maxWidth:"900px", margin:"0 auto" }}>
          <div className="sec-title">// CERTIFICATIONS</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"16px" }}>
            {data.certifications.map(cert => (
              <div key={cert.id} className="card-wrap">
                <div className="glass" style={{ padding:"26px" }}>
                  <div style={{ fontSize:"1.8rem", marginBottom:"14px" }}>🏅</div>
                  <h3 style={{ color:"#e0f0ff", fontSize:"0.92rem", fontWeight:600, marginBottom:"6px", lineHeight:1.4 }}>{cert.name}</h3>
                  <div style={{ color:"#00d4ff", fontSize:"0.78rem", marginBottom:"4px" }}>{cert.issuer}</div>
                  <div style={{ color:"#445566", fontSize:"0.73rem", marginBottom:"14px" }}>Issued: {cert.date} · ID: {cert.credentialId}</div>
                  <a href={cert.link} target="_blank" rel="noreferrer" style={{ ...btnStyle("#00d4ff"), textDecoration:"none", fontSize:"0.68rem" }}>VIEW CREDENTIAL ↗</a>
                </div>
                {isAdmin && (
                  <div className="edit-actions">
                    <button onClick={() => openEdit("certifications",cert)} style={{ ...btnStyle("#00d4ff"), padding:"4px 10px", fontSize:"0.62rem" }}>✏️</button>
                    <button onClick={() => handleDelete("certifications",cert.id)} style={{ ...btnStyle("#ff3c78"), padding:"4px 10px", fontSize:"0.62rem" }}>🗑</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && <button className="add-btn" onClick={() => openAdd("certifications")}>＋ ADD CERTIFICATION</button>}
        </section>

        {/* EXPERIENCE */}
        <section id="experience" style={{ padding:"80px 24px", maxWidth:"900px", margin:"0 auto" }}>
          <div className="sec-title">// EXPERIENCE</div>
          <div style={{ borderLeft:"1px solid rgba(0,212,255,0.15)", paddingLeft:"28px", position:"relative" }}>
            {data.experience.map((exp,i) => (
              <div key={exp.id} className="card-wrap" style={{ marginBottom:"20px", position:"relative" }}>
                <div style={{ position:"absolute", left:"-34px", top:"20px", width:"11px", height:"11px", borderRadius:"50%", background:"#00d4ff", boxShadow:"0 0 10px rgba(0,212,255,0.8)" }} />
                <div className="glass" style={{ padding:"24px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", marginBottom:"6px" }}>
                    <h3 style={{ color:"#00d4ff", fontFamily:"'Orbitron',monospace", fontSize:"0.85rem" }}>{exp.role}</h3>
                    <span style={{ color:"#7c3aed", fontSize:"0.78rem", fontFamily:"'Orbitron',monospace" }}>{exp.period}</span>
                  </div>
                  <div style={{ color:"#88aacc", fontSize:"0.85rem", fontWeight:600, marginBottom:"10px" }}>{exp.company}</div>
                  <p style={{ color:"#667788", fontSize:"0.85rem", lineHeight:1.75 }}>{exp.description}</p>
                </div>
                {isAdmin && (
                  <div className="edit-actions">
                    <button onClick={() => openEdit("experience",exp)} style={{ ...btnStyle("#00d4ff"), padding:"4px 10px", fontSize:"0.62rem" }}>✏️</button>
                    <button onClick={() => handleDelete("experience",exp.id)} style={{ ...btnStyle("#ff3c78"), padding:"4px 10px", fontSize:"0.62rem" }}>🗑</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && <button className="add-btn" onClick={() => openAdd("experience")}>＋ ADD EXPERIENCE</button>}
        </section>

        {/* EDUCATION */}
        <section id="education" style={{ padding:"80px 24px", maxWidth:"900px", margin:"0 auto" }}>
          <div className="sec-title">// EDUCATION</div>
          <div style={{ display:"grid", gap:"14px" }}>
            {data.education.map(edu => (
              <div key={edu.id} className="card-wrap">
                <div className="glass" style={{ padding:"26px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
                    <span style={{ fontSize:"2rem" }}>🎓</span>
                    <div>
                      <h3 style={{ color:"#e0f0ff", fontWeight:600, marginBottom:"4px" }}>{edu.degree}</h3>
                      <div style={{ color:"#00d4ff", fontSize:"0.83rem" }}>{edu.institution}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:"#7c3aed", fontSize:"0.82rem", fontFamily:"'Orbitron',monospace", marginBottom:"4px" }}>{edu.period}</div>
                    <div style={{ color:"#00ff88", fontSize:"0.78rem", fontFamily:"'Orbitron',monospace" }}>{edu.grade}</div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="edit-actions">
                    <button onClick={() => openEdit("education",edu)} style={{ ...btnStyle("#00d4ff"), padding:"4px 10px", fontSize:"0.62rem" }}>✏️</button>
                    <button onClick={() => handleDelete("education",edu.id)} style={{ ...btnStyle("#ff3c78"), padding:"4px 10px", fontSize:"0.62rem" }}>🗑</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && <button className="add-btn" onClick={() => openAdd("education")}>＋ ADD EDUCATION</button>}
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding:"80px 24px", maxWidth:"600px", margin:"0 auto", textAlign:"center" }}>
          <div className="sec-title">// CONTACT</div>
          <div className="glass" style={{ padding:"48px 40px" }}>
            <p style={{ color:"#88aacc", marginBottom:"32px", lineHeight:1.85, fontSize:"0.95rem" }}>
              Interested in working together or have a question? Feel free to reach out!
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {[
                ["📧 Email", `mailto:${data.about.email}`, data.about.email, "#ff3c78"],
                ["💼 LinkedIn", data.about.linkedin, "linkedin.com/in/mayankkohale", "#7c3aed"],
                ["🐙 GitHub", data.about.github, "github.com/mayankkohale", "#00d4ff"],
              ].map(([label,href,display,color]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"14px 20px", borderRadius:"10px",
                  background:`rgba(${color==="#00d4ff"?"0,212,255":color==="#7c3aed"?"124,58,237":"255,60,120"},0.06)`,
                  border:`1px solid ${color}30`, color, textDecoration:"none", fontSize:"0.9rem"
                }}>
                  <span>{label}</span>
                  <span style={{ opacity:0.55, fontSize:"0.78rem" }}>{display} ↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer style={{ textAlign:"center", padding:"28px", borderTop:"1px solid rgba(0,212,255,0.07)", color:"#2a3a4a", fontSize:"0.72rem", fontFamily:"'Orbitron',monospace", letterSpacing:"0.12em" }}>
          © 2024 MAYANK KOHALE &nbsp;·&nbsp; BUILT WITH ❤️ &amp; REACT
        </footer>
      </main>

      {/* FAB */}
      <button className="fab" onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)} title={isAdmin?"Exit Admin Mode":"Admin Login"}>
        {isAdmin ? "🔓" : "🔒"}
      </button>

      {/* LOGIN */}
      {showLogin && (
        <Modal title="⬡ ADMIN ACCESS" onClose={() => { setShowLogin(false); setLoginError(""); setLoginInput(""); }}>
          <p style={{ color:"#556677", fontSize:"0.82rem", marginBottom:"16px", lineHeight:1.6 }}>Enter your password to unlock edit mode.</p>
          <input type="password" placeholder="Admin password" style={inputStyle} value={loginInput}
            onChange={e => setLoginInput(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()} autoFocus />
          {loginError && <div style={{ color:"#ff3c78", fontSize:"0.8rem", marginBottom:"12px" }}>{loginError}</div>}
          <button onClick={handleLogin} style={{ ...btnStyle("#00d4ff"), width:"100%", padding:"12px", fontSize:"0.78rem" }}>
            UNLOCK EDIT MODE
          </button>
        </Modal>
      )}

      {/* ADD/EDIT MODAL */}
      {modal && (
        <Modal title={`${modal.type==="add"?"＋ ADD":"✏️ EDIT"} — ${modal.section.toUpperCase()}`} onClose={closeModal}>
          {modal.section === "skills" && <>
            <input placeholder="Skill Name (e.g. Docker)" style={inputStyle} value={formData.name||""} onChange={e=>setFormData(d=>({...d,name:e.target.value}))} />
            <input placeholder="Category (e.g. Containers)" style={inputStyle} value={formData.category||""} onChange={e=>setFormData(d=>({...d,category:e.target.value}))} />
            <label style={{ color:"#556677", fontSize:"0.72rem", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Proficiency: {formData.level||50}%</label>
            <input type="range" min="0" max="100" style={{ width:"100%", accentColor:"#00d4ff", marginBottom:"16px" }} value={formData.level||50} onChange={e=>setFormData(d=>({...d,level:parseInt(e.target.value)}))} />
          </>}
          {modal.section === "projects" && <>
            <input placeholder="Project Title" style={inputStyle} value={formData.title||""} onChange={e=>setFormData(d=>({...d,title:e.target.value}))} />
            <textarea rows={3} placeholder="Description" style={inputStyle} value={formData.description||""} onChange={e=>setFormData(d=>({...d,description:e.target.value}))} />
            <input placeholder="Tech stack (comma-separated, e.g. Docker, AWS)" style={inputStyle} value={Array.isArray(formData.tech)?formData.tech.join(", "):formData.tech||""} onChange={e=>setFormData(d=>({...d,tech:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} />
            <input placeholder="Project Link (URL)" style={inputStyle} value={formData.link||""} onChange={e=>setFormData(d=>({...d,link:e.target.value}))} />
          </>}
          {modal.section === "certifications" && <>
            <input placeholder="Certification Name" style={inputStyle} value={formData.name||""} onChange={e=>setFormData(d=>({...d,name:e.target.value}))} />
            <input placeholder="Issuing Organization" style={inputStyle} value={formData.issuer||""} onChange={e=>setFormData(d=>({...d,issuer:e.target.value}))} />
            <input placeholder="Year (e.g. 2024)" style={inputStyle} value={formData.date||""} onChange={e=>setFormData(d=>({...d,date:e.target.value}))} />
            <input placeholder="Credential ID" style={inputStyle} value={formData.credentialId||""} onChange={e=>setFormData(d=>({...d,credentialId:e.target.value}))} />
            <input placeholder="Credential Link (URL)" style={inputStyle} value={formData.link||""} onChange={e=>setFormData(d=>({...d,link:e.target.value}))} />
          </>}
          {modal.section === "experience" && <>
            <input placeholder="Job Title / Role" style={inputStyle} value={formData.role||""} onChange={e=>setFormData(d=>({...d,role:e.target.value}))} />
            <input placeholder="Company Name" style={inputStyle} value={formData.company||""} onChange={e=>setFormData(d=>({...d,company:e.target.value}))} />
            <input placeholder="Period (e.g. Jan 2024 – Present)" style={inputStyle} value={formData.period||""} onChange={e=>setFormData(d=>({...d,period:e.target.value}))} />
            <textarea rows={3} placeholder="Describe your role & responsibilities" style={inputStyle} value={formData.description||""} onChange={e=>setFormData(d=>({...d,description:e.target.value}))} />
          </>}
          {modal.section === "education" && <>
            <input placeholder="Degree / Course Name" style={inputStyle} value={formData.degree||""} onChange={e=>setFormData(d=>({...d,degree:e.target.value}))} />
            <input placeholder="Institution / University" style={inputStyle} value={formData.institution||""} onChange={e=>setFormData(d=>({...d,institution:e.target.value}))} />
            <input placeholder="Period (e.g. 2021 – 2025)" style={inputStyle} value={formData.period||""} onChange={e=>setFormData(d=>({...d,period:e.target.value}))} />
            <input placeholder="Grade / CGPA / Score" style={inputStyle} value={formData.grade||""} onChange={e=>setFormData(d=>({...d,grade:e.target.value}))} />
          </>}
          <div style={{ display:"flex", gap:"10px", marginTop:"8px" }}>
            <button onClick={handleSave} style={{ ...btnStyle("#00d4ff"), flex:1, padding:"11px" }}>SAVE</button>
            <button onClick={closeModal} style={{ ...btnStyle("#ff3c78"), flex:1, padding:"11px" }}>CANCEL</button>
          </div>
        </Modal>
      )}
    </>
  );
}
