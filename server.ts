import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("broker.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    phone TEXT,
    crm_bound INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    industry TEXT,
    area TEXT,
    region TEXT,
    type TEXT,
    client_name TEXT,
    client_phone TEXT,
    stage TEXT,
    last_contact TEXT,
    remarks TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS follow_up_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    user_id INTEGER,
    time TEXT,
    action TEXT,
    topic TEXT,
    goal TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(project_id) REFERENCES projects(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS drill_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_id INTEGER,
    scenario_type TEXT,
    transcript TEXT,
    score INTEGER,
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_id INTEGER,
    role TEXT,
    content TEXT,
    type TEXT DEFAULT 'chat',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Mock Data Insertion
const mockUser = db.prepare("SELECT * FROM users WHERE email = ?").get("broker@example.com") as any;
if (true) { // Force update for demo
  let userId;
  if (!mockUser) {
    const info = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)").run("broker@example.com", "金牌经纪人");
    userId = info.lastInsertRowid;
  } else {
    userId = mockUser.id;
  }

  // Insert Mock Projects
  db.prepare("DELETE FROM follow_up_plans").run();
  db.prepare("DELETE FROM drill_records").run();
  db.prepare("DELETE FROM chat_history").run();
  db.prepare("DELETE FROM projects").run();
  const projects = [
    { name: "【优】芯动科技芯片制造5000平厂房", industry: "芯片制造", area: "5000平", region: "苏州工业园", type: "厂房", client_name: "张总", client_phone: "13800138001", stage: "房源匹配", remarks: "关注防静电和供电稳定性" },
    { name: "【良】优选食品消费品代工2000平仓库", industry: "消费品代工", area: "2000平", region: "嘉兴经开区", type: "仓库", client_name: "李经理", client_phone: "13900139002", stage: "夯实", remarks: "价格敏感，需要物流便利" },
    { name: "【优】恒能电池新能源10000平厂房", industry: "新能源", area: "10000平", region: "常州金坛", type: "厂房", client_name: "王工", client_phone: "13700137003", stage: "带看", remarks: "需要大容量供电和环保设施" },
    { name: "【良】大疆创新无人机3000平研发办公", industry: "无人机", area: "3000平", region: "深圳南山", type: "研发办公", client_name: "刘工", client_phone: "13600136004", stage: "未推进", remarks: "需要高层视野" },
    { name: "【优】宁德时代动力电池20000平厂房", industry: "动力电池", area: "20000平", region: "宁德", type: "厂房", client_name: "陈总", client_phone: "13500135005", stage: "签约", remarks: "扩产需求" },
    { name: "【优】比亚迪新能源汽车15000平厂房", industry: "新能源汽车", area: "15000平", region: "西安", type: "厂房", client_name: "周经理", client_phone: "13400134006", stage: "回款中", remarks: "二期工程" },
    { name: "【良】华为技术通信设备8000平研发中心", industry: "通信设备", area: "8000平", region: "东莞松山湖", type: "研发中心", client_name: "赵工", client_phone: "13300133007", stage: "回款完成", remarks: "长期合作" },
    { name: "【优】腾讯云云计算12000平数据中心", industry: "云计算", area: "12000平", region: "贵安新区", type: "数据中心", client_name: "马经理", client_phone: "13200132008", stage: "夯实", remarks: "高算力需求" },
    { name: "【良】阿里巴巴电商物流30000平物流园", industry: "电商物流", area: "30000平", region: "杭州余杭", type: "物流园", client_name: "蔡总", client_phone: "13100131009", stage: "签约", remarks: "自动化仓储" },
    { name: "【优】美团点评生活服务5000平办公楼", industry: "生活服务", area: "5000平", region: "北京朝阳", type: "办公楼", client_name: "王总", client_phone: "13000130010", stage: "房源匹配", remarks: "核心商圈" },
    { name: "【良】小米科技智能硬件6000平研发基地", industry: "智能硬件", area: "6000平", region: "武汉光谷", type: "研发基地", client_name: "雷经理", client_phone: "12900129011", stage: "带看", remarks: "人才政策关注" },
    { name: "【优】百度搜索人工智能4000平研发中心", industry: "人工智能", area: "4000平", region: "北京海淀", type: "研发中心", client_name: "李总", client_phone: "12800128012", stage: "回款中", remarks: "算力中心配套" },
    { name: "【良】京东物流智慧物流25000平分拨中心", industry: "智慧物流", area: "25000平", region: "上海青浦", type: "分拨中心", client_name: "刘经理", client_phone: "12700127013", stage: "夯实", remarks: "冷链需求" },
    { name: "【优】顺丰速运快递航空18000平航空货运枢纽", industry: "快递航空", area: "18000平", region: "鄂州", type: "航空货运枢纽", client_name: "王总", client_phone: "12600126014", stage: "签约", remarks: "跑道对接" },
    { name: "蔚来汽车", industry: "智能电动车", area: "12000平", region: "合肥", type: "整车工厂", client_name: "李经理", client_phone: "12500125015", stage: "回款完成", remarks: "换电站配套" },
    { name: "小鹏汽车", industry: "智能电动车", area: "10000平", region: "肇庆", type: "生产基地", client_name: "何总", client_phone: "12400124016", stage: "房源匹配", remarks: "自动驾驶测试场" },
    { name: "理想汽车", industry: "智能电动车", area: "11000平", region: "常州", type: "制造基地", client_name: "李经理", client_phone: "12300123017", stage: "夯实", remarks: "增程器生产" },
    { name: "极氪汽车", industry: "新能源车", area: "9000平", region: "宁波", type: "研发中心", client_name: "安总", client_phone: "12200122018", stage: "带看", remarks: "高端品牌定位" },
    { name: "隆基绿能", industry: "光伏", area: "15000平", region: "西安", type: "组件工厂", client_name: "钟总", client_phone: "12100121019", stage: "签约", remarks: "单晶硅片生产" },
    { name: "通威股份", industry: "光伏/饲料", area: "13000平", region: "成都", type: "生产基地", client_name: "刘经理", client_phone: "12000120020", stage: "回款中", remarks: "多晶硅扩产" }
  ];

  for (const p of projects) {
    const pInfo = db.prepare(`
      INSERT INTO projects (user_id, name, industry, area, region, type, client_name, client_phone, stage, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, p.name, p.industry, p.area, p.region, p.type, p.client_name, p.client_phone, p.stage, p.remarks);
    
    // Insert a mock plan for each
    db.prepare(`
      INSERT INTO follow_up_plans (project_id, user_id, time, action, topic, goal)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(pInfo.lastInsertRowid, userId, new Date(Date.now() + 86400000 * 2).toISOString(), "电话跟进", "确认技术指标", "邀约实地考察");
  }
}

async function startServer() {
  const app = express();
  const PORT = 3300;

  app.use(express.json());

  // --- API Routes ---

  // Auth (Mock for now, simple ID based)
  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      const info = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)").run(email, email.split('@')[0]);
      user = { id: info.lastInsertRowid, email, name: email.split('@')[0] };
    }
    res.json({ user });
  });

  // Projects
  app.get("/api/projects", (req, res) => {
    const userId = req.query.userId;
    const projects = db.prepare("SELECT * FROM projects WHERE user_id = ?").all(userId);
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const { user_id, name, industry, area, region, type, client_name, client_phone, stage, remarks } = req.body;
    const info = db.prepare(`
      INSERT INTO projects (user_id, name, industry, area, region, type, client_name, client_phone, stage, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(user_id, name, industry, area, region, type, client_name, client_phone, stage, remarks);
    res.json({ id: info.lastInsertRowid });
  });

  // Follow-up Plans
  app.get("/api/plans", (req, res) => {
    const userId = req.query.userId;
    const plans = db.prepare("SELECT * FROM follow_up_plans WHERE user_id = ? ORDER BY time ASC").all(userId);
    res.json(plans);
  });

  app.post("/api/plans", (req, res) => {
    const { project_id, user_id, time, action, topic, goal } = req.body;
    const info = db.prepare(`
      INSERT INTO follow_up_plans (project_id, user_id, time, action, topic, goal)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(project_id, user_id, time, action, topic, goal);
    res.json({ id: info.lastInsertRowid });
  });

  // Drill Records
  app.get("/api/drills", (req, res) => {
    const userId = req.query.userId;
    const drills = db.prepare("SELECT * FROM drill_records WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    res.json(drills);
  });

  app.post("/api/drills", (req, res) => {
    const { user_id, project_id, scenario_type, transcript, score, feedback } = req.body;
    const info = db.prepare(`
      INSERT INTO drill_records (user_id, project_id, scenario_type, transcript, score, feedback)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user_id, project_id, scenario_type, JSON.stringify(transcript), score, JSON.stringify(feedback));
    res.json({ id: info.lastInsertRowid });
  });

  // --- AI Proxy (DashScope / Bailian) ---
  app.post("/api/ai/chat", async (req, res) => {
    const { messages, jsonMode = false, systemInstruction } = req.body;
    try {
      const apiMessages: Array<{ role: string; content: string }> = [];
      if (systemInstruction) {
        apiMessages.push({ role: "system", content: systemInstruction });
      }
      apiMessages.push(...messages);

      const aiRes = await fetch(
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY || ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "qwen-plus",
            messages: apiMessages,
            ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
          }),
        }
      );
      const data = (await aiRes.json()) as any;
      res.json({ content: data.choices?.[0]?.message?.content || "" });
    } catch (err) {
      console.error("AI proxy error:", err);
      res.status(500).json({ content: "" });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
