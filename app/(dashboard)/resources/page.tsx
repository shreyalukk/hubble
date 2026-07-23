import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ResourcesClient, ResourceItem } from "./resources-client";

const DEFAULT_ENGINEERING_RESOURCES: ResourceItem[] = [
  // CSE & ISE
  {
    id: "eng-cs-1",
    title: "Data Structures & Algorithms in C++",
    department: "CSE (Computer Science)",
    fileType: "Reference Book",
    authorOrSubject: "Ellis Horowitz, Sartaj Sahni & Dinesh Mehta",
    fileUrl: "https://drive.google.com/file/d/1_dsa_horowitz_book/view",
    uploaderName: "Prof. Ananya Rao (CSE)",
    createdAt: "2026-07-01",
  },
  {
    id: "eng-cs-2",
    title: "2024 End-Sem Data Structures & Algorithms Question Paper with Solutions",
    department: "CSE (Computer Science)",
    fileType: "PYQ (Question Paper)",
    authorOrSubject: "Subject Code: CS301 (2024 Exam)",
    fileUrl: "https://drive.google.com/file/d/1_dsa_2024_pyq/view",
    uploaderName: "Exam Cell",
    createdAt: "2026-06-15",
  },
  {
    id: "eng-cs-3",
    title: "Operating System Concepts (10th Edition)",
    department: "CSE (Computer Science)",
    fileType: "Reference Book",
    authorOrSubject: "Silberschatz, Galvin & Gagne",
    fileUrl: "https://drive.google.com/file/d/1_os_galvin_10th/view",
    uploaderName: "Prof. Rajesh Sharma",
    createdAt: "2026-06-20",
  },
  {
    id: "eng-cs-4",
    title: "2023 End-Sem Operating Systems Question Paper",
    department: "CSE (Computer Science)",
    fileType: "PYQ (Question Paper)",
    authorOrSubject: "Subject Code: CS402 (2023 Exam)",
    fileUrl: "https://drive.google.com/file/d/1_os_2023_pyq/view",
    uploaderName: "Department Library",
    createdAt: "2026-05-10",
  },
  {
    id: "eng-cs-5",
    title: "Database System Concepts (7th Edition)",
    department: "CSE (Computer Science)",
    fileType: "Reference Book",
    authorOrSubject: "Abraham Silberschatz, Henry F. Korth & S. Sudarshan",
    fileUrl: "https://drive.google.com/file/d/1_dbms_korth_7th/view",
    uploaderName: "Prof. Kavita Nair",
    createdAt: "2026-06-25",
  },
  {
    id: "eng-cs-6",
    title: "Complete Computer Networks Hand-written Lecture Notes",
    department: "ISE (Information Science)",
    fileType: "Lecture Notes",
    authorOrSubject: "Subject Code: IS501 (VTU Syllabus)",
    fileUrl: "https://drive.google.com/file/d/1_cn_notes_vtu/view",
    uploaderName: "Aarav Patel (Student Lead)",
    createdAt: "2026-07-10",
  },

  // AI & DS
  {
    id: "eng-ai-1",
    title: "Artificial Intelligence: A Modern Approach (4th Edition)",
    department: "AI & DS (AI & Data Science)",
    fileType: "Reference Book",
    authorOrSubject: "Stuart Russell & Peter Norvig",
    fileUrl: "https://drive.google.com/file/d/1_aima_russell_4th/view",
    uploaderName: "Dr. Vikram Singh (AI Lab)",
    createdAt: "2026-07-05",
  },
  {
    id: "eng-ai-2",
    title: "2024 Mid-Sem Machine Learning & Neural Networks PYQ",
    department: "AI & DS (AI & Data Science)",
    fileType: "PYQ (Question Paper)",
    authorOrSubject: "Subject Code: AI601 (2024 Exam)",
    fileUrl: "https://drive.google.com/file/d/1_ml_2024_pyq/view",
    uploaderName: "Academic Section",
    createdAt: "2026-06-30",
  },

  // ECE & EEE
  {
    id: "eng-ece-1",
    title: "Microelectronic Circuits (7th Edition)",
    department: "ECE (Electronics & Comm)",
    fileType: "Reference Book",
    authorOrSubject: "Adel S. Sedra & Kenneth C. Smith",
    fileUrl: "https://drive.google.com/file/d/1_sedra_smith_7th/view",
    uploaderName: "Prof. Suresh Kumar (ECE)",
    createdAt: "2026-06-18",
  },
  {
    id: "eng-ece-2",
    title: "2024 Mid-Sem Signals & Systems Question Paper & Solution Key",
    department: "ECE (Electronics & Comm)",
    fileType: "PYQ (Question Paper)",
    authorOrSubject: "Subject Code: EC403 (2024 Exam)",
    fileUrl: "https://drive.google.com/file/d/1_signals_2024_pyq/view",
    uploaderName: "Department Cell",
    createdAt: "2026-06-01",
  },
  {
    id: "eng-eee-1",
    title: "Digital Design (6th Edition)",
    department: "EEE (Electrical & Electronics)",
    fileType: "Reference Book",
    authorOrSubject: "M. Morris Mano & Michael D. Ciletti",
    fileUrl: "https://drive.google.com/file/d/1_mano_digital_design/view",
    uploaderName: "Prof. Meena Deshmukh",
    createdAt: "2026-06-12",
  },
  {
    id: "eng-eee-2",
    title: "2023 End-Sem Analog Electronics Question Paper",
    department: "EEE (Electrical & Electronics)",
    fileType: "PYQ (Question Paper)",
    authorOrSubject: "Subject Code: EE302 (2023 Exam)",
    fileUrl: "https://drive.google.com/file/d/1_analog_2023_pyq/view",
    uploaderName: "Exam Section",
    createdAt: "2026-05-20",
  },

  // ME & CIVIL
  {
    id: "eng-me-1",
    title: "Higher Engineering Mathematics (44th Edition)",
    department: "ME (Mechanical Engg)",
    fileType: "Reference Book",
    authorOrSubject: "Dr. B.S. Grewal",
    fileUrl: "https://drive.google.com/file/d/1_bs_grewal_44th/view",
    uploaderName: "Math Department",
    createdAt: "2026-05-15",
  },
  {
    id: "eng-me-2",
    title: "Engineering Thermodynamics (5th Edition)",
    department: "ME (Mechanical Engg)",
    fileType: "Reference Book",
    authorOrSubject: "P.K. Nag",
    fileUrl: "https://drive.google.com/file/d/1_pk_nag_thermo/view",
    uploaderName: "Prof. Harish Hegde (ME)",
    createdAt: "2026-06-22",
  },
  {
    id: "eng-me-3",
    title: "2024 End-Sem Engineering Thermodynamics Question Paper",
    department: "ME (Mechanical Engg)",
    fileType: "PYQ (Question Paper)",
    authorOrSubject: "Subject Code: ME304 (2024 Exam)",
    fileUrl: "https://drive.google.com/file/d/1_thermo_2024_pyq/view",
    uploaderName: "Academic Cell",
    createdAt: "2026-07-02",
  },
  {
    id: "eng-civ-1",
    title: "Design of Concrete Structures (15th Edition)",
    department: "CIVIL (Civil Engg)",
    fileType: "Reference Book",
    authorOrSubject: "Arthur H. Nilson, David Darwin & Charles W. Dolan",
    fileUrl: "https://drive.google.com/file/d/1_nilson_concrete_15th/view",
    uploaderName: "Prof. S. Ranganath",
    createdAt: "2026-06-14",
  },
  {
    id: "eng-civ-2",
    title: "2023 End-Sem Strength of Materials Question Paper",
    department: "CIVIL (Civil Engg)",
    fileType: "PYQ (Question Paper)",
    authorOrSubject: "Subject Code: CV301 (2023 Exam)",
    fileUrl: "https://drive.google.com/file/d/1_som_2023_pyq/view",
    uploaderName: "Civil Department Library",
    createdAt: "2026-05-28",
  },
];

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch database uploaded resources
  const { data: dbResources } = await supabase
    .from("resources")
    .select(`
      id,
      title,
      file_url,
      file_type,
      created_at,
      hubs(name),
      users(full_name)
    `)
    .order("created_at", { ascending: false });

  // Fetch hubs
  const { data: hubsData } = await supabase.from("hubs").select("id, name");

  const dbFormatted: ResourceItem[] = (dbResources || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    department: "CSE (Computer Science)",
    fileUrl: r.file_url,
    fileType: r.file_type || "Reference Book",
    authorOrSubject: r.hubs?.name || "Campus Resource",
    hubName: r.hubs?.name || "Campus Library",
    uploaderName: r.users?.full_name || "Faculty",
    createdAt: new Date(r.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  const allResources = [...dbFormatted, ...DEFAULT_ENGINEERING_RESOURCES];

  return (
    <ResourcesClient
      initialResources={allResources}
      currentUserId={user.id}
      hubs={hubsData || []}
    />
  );
}
