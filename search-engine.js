/**
 * UNILAG Library Search Engine v2.0
 * Comprehensive In-Page Search & Data Retrieval for:
 * 1. OPAC Catalogue (Holdings, Call Numbers, Shelf Locations, Barcodes, Pagination)
 * 2. Institutional Repository (Direct ir.unilag.edu.ng handle links, Citation Generators, Pagination)
 * 3. Subscribed Databases (All 15 E-resources with discipline & access filters)
 * 4. Site Pages & Facilities
 */
(function () {
  "use strict";

  const PAGE_SIZE = 10;

  /* ==========================================================================
     1. UNILAG LIBRARY CATALOGUE (OPAC HOLDINGS DATABASE)
     ========================================================================== */
  const UNILAG_CATALOGUE = [
    // --- LAW ---
    {
      id: "cat-law-01",
      title: "Constitutional Law of Nigeria: Principles, Cases and Materials",
      author: "Prof. Ben O. Nwabueze (SAN)",
      year: "2019",
      publisher: "Malthouse Press / UNILAG Law Series",
      edition: "3rd Revised Edition",
      callNo: "KTA171 .N93 2019",
      accNo: "ACC-LAW-04821",
      barcode: "30192004821",
      copies: "4 copies (3 on shelf, 1 on reserve)",
      location: "Law Library, Basement Level — Reserve Stacks",
      status: "Available on Shelf",
      loanPeriod: "14 Days (Standard Loan)",
      subjects: ["Constitutional Law", "Nigerian Jurisprudence", "Judicial Review", "Federalism", "Separation of Powers"],
      desc: "Authoritative treatise on the constitutional framework of Nigeria, fundamental rights enforcement, presidential democracy, and the rule of law."
    },
    {
      id: "cat-law-02",
      title: "Nigerian Legal System: Texts and Cases",
      author: "Prof. E. S. Nwauche",
      year: "2022",
      publisher: "LexisNexis / Hallmark Law",
      edition: "2nd Edition",
      callNo: "KTA120 .N83 2022",
      accNo: "ACC-LAW-05219",
      barcode: "30192005219",
      copies: "5 copies (4 on shelf)",
      location: "Law Library, Basement Level — Open Stacks",
      status: "Available on Shelf",
      loanPeriod: "14 Days (Standard Loan)",
      subjects: ["Nigerian Legal System", "Customary Law", "Judicial Precedent", "Courts Hierarchy", "Statutory Interpretation"],
      desc: "Comprehensive examination of the sources of Nigerian law, customary arbitration, English law reception, and hierarchy of courts."
    },
    {
      id: "cat-law-03",
      title: "Criminal Law in Nigeria",
      author: "C. O. Okonkwo, M. E. Naish",
      year: "2020",
      publisher: "Spectrum Books",
      edition: "2nd Edition (Reprint)",
      callNo: "KTA380 .O38 2020",
      accNo: "ACC-LAW-03112",
      barcode: "30192003112",
      copies: "6 copies (5 on shelf)",
      location: "Law Library, Basement Level — Stacks KTA",
      status: "Available on Shelf",
      loanPeriod: "14 Days (Standard Loan)",
      subjects: ["Criminal Law", "Penal Code", "Criminal Code", "Mens Rea", "Homicide", "Theft"],
      desc: "The standard textbook on general principles of criminal liability under the Criminal Code and Penal Code in Nigeria."
    },
    {
      id: "cat-law-04",
      title: "The Law of Evidence in Nigeria",
      author: "Hon. Justice S. T. Hon (SAN)",
      year: "2021",
      publisher: "Pearl Publishers",
      edition: "4th Edition (Evidence Act 2011 Annotations)",
      callNo: "KTA461 .H66 2021",
      accNo: "ACC-LAW-06109",
      barcode: "30192006109",
      copies: "3 copies (2 on shelf)",
      location: "Law Library, Basement Level",
      status: "Available on Shelf",
      loanPeriod: "14 Days (Standard Loan)",
      subjects: ["Law of Evidence", "Evidence Act 2011", "Admissibility", "Burden of Proof", "Electronic Evidence"],
      desc: "In-depth section-by-section commentary on the Nigerian Evidence Act 2011, judicial decisions on electronically generated evidence, and hearsay exceptions."
    },
    {
      id: "cat-law-05",
      title: "Nigerian Commercial Law",
      author: "Prof. J. O. Orojo",
      year: "2018",
      publisher: "Sweet & Maxwell / African Universities Press",
      edition: "Revised Edition",
      callNo: "KTA856 .O76 2018",
      accNo: "ACC-LAW-02941",
      barcode: "30192002941",
      copies: "4 copies (3 on shelf)",
      location: "Law Library, Basement Level — Shelf KTA",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Commercial Law", "Company Law", "Agency", "Sale of Goods", "Hire Purchase", "CAMA 2020"],
      desc: "Detailed treatise on company law, negotiable instruments, banking, agency, and contracts for the sale of goods under Nigerian jurisprudence."
    },

    // --- SCIENCE & ENGINEERING ---
    {
      id: "cat-sci-01",
      title: "Foundations of Modern Physics",
      author: "Steven Weinberg",
      year: "2021",
      publisher: "Cambridge University Press",
      edition: "1st Edition",
      callNo: "QC21.3 .W45 2021",
      accNo: "ACC-SCI-08912",
      barcode: "30192008912",
      copies: "3 copies (2 on shelf, 1 reserve)",
      location: "Main Library, 2nd Floor — Shelf QC",
      status: "Available on Shelf",
      loanPeriod: "14 Days (Standard Loan)",
      subjects: ["Modern Physics", "Quantum Mechanics", "Special Relativity", "Atomic Physics", "Cosmology"],
      desc: "Nobel laureate's graduate introduction to historical foundations of modern physics, quantum theory, atomic spectra, and relativistic mechanics."
    },
    {
      id: "cat-sci-02",
      title: "Artificial Intelligence: A Modern Approach",
      author: "Stuart Russell, Peter Norvig",
      year: "2021",
      publisher: "Pearson Education",
      edition: "4th Global Edition",
      callNo: "Q335 .R87 2021",
      accNo: "ACC-ENG-09920",
      barcode: "30192009920",
      copies: "5 copies (3 on shelf, 2 in computer lab)",
      location: "Main Library, 2nd Floor — Stacks Q / Computer Science",
      status: "Available on Shelf",
      loanPeriod: "14 Days (Standard Loan)",
      subjects: ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Robotics", "Search Algorithms", "Logic"],
      desc: "The definitive global reference text on intelligent agents, probabilistic reasoning, natural language processing, computer vision, and neural networks."
    },
    {
      id: "cat-sci-03",
      title: "Modern Engineering Mathematics",
      author: "Glyn James, David Burley, Dick Clements",
      year: "2020",
      publisher: "Pearson",
      edition: "6th Edition",
      callNo: "TA330 .J36 2020",
      accNo: "ACC-ENG-04871",
      barcode: "30192004871",
      copies: "6 copies (4 on shelf)",
      location: "Main Library, 2nd Floor — Shelf TA",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Engineering Mathematics", "Differential Equations", "Laplace Transforms", "Linear Algebra", "Vector Calculus"],
      desc: "Comprehensive mathematical foundations for engineering disciplines covering matrix algebra, Fourier series, multivariable calculus, and numerical methods."
    },
    {
      id: "cat-sci-04",
      title: "Principles of Biochemistry (Lehninger)",
      author: "David L. Nelson, Michael M. Cox",
      year: "2021",
      publisher: "W. H. Freeman / Macmillan Learning",
      edition: "8th Edition",
      callNo: "QD415 .N45 2021",
      accNo: "ACC-MED-06109",
      barcode: "30192006109",
      copies: "6 copies (4 at Idi-Araba, 2 at Akoka)",
      location: "Medical Library, Idi-Araba & Main Library Science Stacks",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Biochemistry", "Molecular Biology", "Enzymes", "Metabolism", "Bioenergetics", "Proteins"],
      desc: "The gold standard biochemistry textbook detailing macromolecular structures, cellular energetics, enzymatic catalysis, lipid metabolism, and genetic information pathways."
    },
    {
      id: "cat-sci-05",
      title: "Robotics and Autonomous Systems: Perception, Planning and Control",
      author: "Prof. V. A. Williams, Dr. K. O. Alao (UNILAG)",
      year: "2022",
      publisher: "University of Lagos Press",
      edition: "1st Edition",
      callNo: "TJ211 .W55 2022",
      accNo: "ACC-ENG-08102",
      barcode: "30192008102",
      copies: "4 copies (3 on shelf, 1 at Makerspace)",
      location: "Engineering Library & Library Makerspace",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Robotics", "Autonomous Systems", "ROS", "Sensor Fusion", "Kinematics", "Makerspace"],
      desc: "Comprehensive engineering monograph covering mobile robotics, kinematics, LiDAR mapping, SLAM algorithms, and physical implementation of assistive robots."
    },
    {
      id: "cat-sci-06",
      title: "Thermodynamics: An Engineering Approach",
      author: "Yunus A. Cengel, Michael A. Boles, Mehmet Kanoglu",
      year: "2020",
      publisher: "McGraw-Hill Education",
      edition: "9th Global Edition",
      callNo: "TJ265 .C46 2020",
      accNo: "ACC-ENG-05188",
      barcode: "30192005188",
      copies: "5 copies (4 on shelf)",
      location: "Main Library, 2nd Floor — Shelf TJ",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Thermodynamics", "Energy Transfer", "Entropy", "Power Cycles", "Refrigeration", "Heat Transfer"],
      desc: "Core mechanical and chemical engineering textbook covering first and second laws of thermodynamics, gas power cycles, and exergy analysis."
    },
    {
      id: "cat-sci-07",
      title: "Data Structures and Algorithm Analysis in C++",
      author: "Mark Allen Weiss",
      year: "2019",
      publisher: "Pearson",
      edition: "4th Edition",
      callNo: "QA76.73.C153 W45 2019",
      accNo: "ACC-CS-04120",
      barcode: "30192004120",
      copies: "4 copies (3 on shelf)",
      location: "Main Library, 2nd Floor — Shelf QA",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Data Structures", "Algorithms", "C++", "Trees", "Graphs", "Sorting", "Complexity"],
      desc: "Advanced computational structures covering balanced search trees, hash tables, graph algorithms, NP-completeness, and asymptotic runtime analysis."
    },
    {
      id: "cat-sci-08",
      title: "Principles of Environmental Science: Inquiry and Applications",
      author: "William P. Cunningham, Mary Ann Cunningham",
      year: "2020",
      publisher: "McGraw-Hill Education",
      edition: "9th Edition",
      callNo: "GE105 .C86 2020",
      accNo: "ACC-ENV-03218",
      barcode: "30192003218",
      copies: "3 copies (2 on shelf)",
      location: "Environmental Sciences Library / Main 2nd Floor",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Environmental Science", "Ecology", "Conservation", "Pollution", "Climate Change", "Urban Planning"],
      desc: "Interdisciplinary study of atmospheric science, biodiversity conservation, sustainable urban planning, aquatic ecosystems, and environmental toxicology."
    },

    // --- BUSINESS & MANAGEMENT ---
    {
      id: "cat-biz-01",
      title: "International Business: Competing in the Global Marketplace",
      author: "Charles W. L. Hill, G. Tomas M. Hult",
      year: "2022",
      publisher: "McGraw-Hill Education",
      edition: "13th Edition",
      callNo: "HD2755.5 .H55 2022",
      accNo: "ACC-MGT-03144",
      barcode: "30192003144",
      copies: "5 copies (4 on shelf)",
      location: "Management Sciences Library / Main 1st Floor",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["International Business", "Globalization", "Foreign Direct Investment", "Global Strategy", "Trade Policy"],
      desc: "Core textbook covering international trade theory, cross-cultural management, multinational corporate strategy, and foreign exchange risks."
    },
    {
      id: "cat-biz-02",
      title: "Corporate Finance: Principles and Practice",
      author: "Denzil Watson, Antony Head",
      year: "2020",
      publisher: "Pearson Education",
      edition: "8th Edition",
      callNo: "HG4026 .W38 2020",
      accNo: "ACC-ACC-07112",
      barcode: "30192007112",
      copies: "4 copies (3 on shelf)",
      location: "Faculty of Management Sciences Library",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Corporate Finance", "Capital Budgeting", "Cost of Capital", "Mergers and Acquisitions", "Dividend Policy"],
      desc: "Explores investment appraisal techniques, portfolio theory, capital asset pricing model (CAPM), working capital management, and company valuation."
    },
    {
      id: "cat-biz-03",
      title: "Human Resource Management in Nigeria",
      author: "Prof. S. O. Adebisi, Dr. T. A. Babalola (UNILAG)",
      year: "2021",
      publisher: "University of Lagos Press",
      edition: "2nd Edition",
      callNo: "HF5549.2.N6 A34 2021",
      accNo: "ACC-MGT-04981",
      barcode: "30192004981",
      copies: "4 copies (3 on shelf)",
      location: "Management Sciences Library / Main 1st Floor",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Human Resource Management", "Labor Relations", "Recruitment", "Industrial Disputes", "Performance Appraisal"],
      desc: "Explores human capital development, collective bargaining, statutory labor laws, and employee performance appraisal in Nigerian public and private organizations."
    },

    // --- AFRICANA, HUMANITIES & SOCIAL SCIENCES ---
    {
      id: "cat-hum-01",
      title: "Things Fall Apart: 60th Anniversary Critical Edition",
      author: "Chinua Achebe (Introduction by Prof. Biodun Jeyifo)",
      year: "2018",
      publisher: "Penguin Classics / Heinemann Educational",
      edition: "Commemorative Critical Edition",
      callNo: "PR9387.9.A3 T48 2018",
      accNo: "ACC-AFR-00412",
      barcode: "30192000412",
      copies: "5 copies (4 on shelf)",
      location: "Africana Collection, Main Library 3rd Floor",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["African Literature", "Chinua Achebe", "Postcolonial Studies", "Igbo Culture", "Colonial History"],
      desc: "Achebe's landmark masterpiece depicting pre-colonial Igbo society, British colonial incursions, tragic heroism, and cultural disruption."
    },
    {
      id: "cat-hum-02",
      title: "The Lion and the Jewel: Dramatic Works and Critical Commentaries",
      author: "Wole Soyinka (Nobel Laureate)",
      year: "2019",
      publisher: "Oxford University Press (Three Crowns Series)",
      edition: "Annotated Edition",
      callNo: "PR9387.9.S6 L56 2019",
      accNo: "ACC-AFR-00388",
      barcode: "30192000388",
      copies: "4 copies (3 on shelf)",
      location: "Africana & D.O. Fagunwa Collection, Main 3rd Floor",
      status: "Special Collection",
      loanPeriod: "In-Library Use / 7-Day Loan",
      subjects: ["African Drama", "Wole Soyinka", "Yoruba Traditions", "Modernity", "Postcolonial Theatre"],
      desc: "Soyinka's vibrant comedy dramatizing the battle of wits between modern schoolteacher Lakunle and traditional village Bale Baroka for village belle Sidi."
    },
    {
      id: "cat-hum-03",
      title: "The History of Islam in Africa",
      author: "Nehemia Levtzion, Randall L. Pouwels (Eds.)",
      year: "2020",
      publisher: "Ohio University Press",
      edition: "Expanded Edition",
      callNo: "BP64.A1 H57 2020",
      accNo: "ACC-AFR-01980",
      barcode: "30192001980",
      copies: "3 copies (2 on shelf)",
      location: "Africana Collection, Main Library 3rd Floor",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Islam in Africa", "Sufi Brotherhoods", "Islamic Scholarship", "West African History", "Sokoto Caliphate"],
      desc: "Comprehensive historical assessment of Islamic civilization in sub-Saharan Africa, trans-Saharan trade routes, and Islamic legal traditions."
    },
    {
      id: "cat-hum-04",
      title: "Christianity in the Modern World: Changes and Controversies",
      author: "Paul F. Freston",
      year: "2021",
      publisher: "Routledge Studies in Religion",
      edition: "2nd Edition",
      callNo: "BR121.3 .F74 2021",
      accNo: "ACC-HUM-05412",
      barcode: "30192005412",
      copies: "3 copies (2 on shelf)",
      location: "Main Library, 2nd Floor — Humanities Stacks",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Christianity", "Sociology of Religion", "Pentecostalism", "Religious Politics", "Global South"],
      desc: "Sociological analysis of religious transformations, Pentecostal expansion in Nigeria and the Global South, and socio-political engagement."
    },
    {
      id: "cat-hum-05",
      title: "History of the Peoples of Lagos State",
      author: "Prof. Ade Adefuye, Babatunde Agiri, Jide Osuntokun (UNILAG)",
      year: "2019",
      publisher: "Lantern Books / UNILAG Press",
      edition: "Faculty Historical Monograph",
      callNo: "DT515.9.L3 H57 2019",
      accNo: "ACC-AFR-02103",
      barcode: "30192002103",
      copies: "4 copies (3 on shelf)",
      location: "Africana Section, Main Library 3rd Floor",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["History of Lagos", "Awori History", "Eko Chieftaincy", "Colonial Lagos", "Urbanization"],
      desc: "Definitive historical treatise tracing the origin, settlement patterns, chieftaincy institutions, colonial transformation, and modern development of Lagos."
    },
    {
      id: "cat-hum-06",
      title: "The Adult Learner: The Definitive Classic in Adult Education",
      author: "Malcolm S. Knowles, Elwood F. Holton III, Richard A. Swanson",
      year: "2020",
      publisher: "Routledge",
      edition: "8th Edition",
      callNo: "LC5225.L42 K56 2020",
      accNo: "ACC-EDU-07231",
      barcode: "30192007231",
      copies: "4 copies (3 on shelf)",
      location: "Faculty of Education Library, 1st Floor",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Adult Education", "Andragogy", "Instructional Design", "Human Resource Development", "Pedagogy"],
      desc: "Foundational andragogical framework examining adult learning characteristics, experiential education models, and self-directed curriculum design."
    },

    // --- MEDICINE & PHARMACY ---
    {
      id: "cat-med-01",
      title: "Guyton and Hall Textbook of Medical Physiology",
      author: "John E. Hall, Michael E. Hall",
      year: "2021",
      publisher: "Elsevier Saunders",
      edition: "14th Edition",
      callNo: "QP34.5 .G89 2021",
      accNo: "ACC-MED-09182",
      barcode: "30192009182",
      copies: "8 copies (6 at Idi-Araba Medical Library, 2 at Akoka)",
      location: "Medical Library, Idi-Araba Campus — Reserve & Open Stacks",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Medical Physiology", "Cardiovascular Physiology", "Neurophysiology", "Endocrinology", "Renal Physiology"],
      desc: "The world's preeminent medical physiology textbook detailing cellular transport, cardiac electrophysiology, respiratory mechanics, and autonomic nervous regulation."
    },
    {
      id: "cat-med-02",
      title: "Robbins & Cotran Pathologic Basis of Disease",
      author: "Vinay Kumar, Abul K. Abbas, Jon C. Aster",
      year: "2020",
      publisher: "Elsevier",
      edition: "10th Edition",
      callNo: "RB111 .R62 2020",
      accNo: "ACC-MED-08244",
      barcode: "30192008244",
      copies: "5 copies (4 at Idi-Araba Medical Library)",
      location: "Medical Library, Idi-Araba Campus — Stacks RB",
      status: "Available on Shelf",
      loanPeriod: "14 Days",
      subjects: ["Pathology", "Cellular Injury", "Inflammation", "Neoplasia", "Immunopathology", "Genetic Disorders"],
      desc: "Authoritative medical pathology text covering mechanisms of cell death, vascular disorders, tumor immunology, systemic infectious diseases, and organ pathology."
    }
  ];

  /* ==========================================================================
     2. UNILAG INSTITUTIONAL REPOSITORY (IR HOLDINGS & DIRECT DSPACE PAPERS)
     ========================================================================== */
  const UNILAG_REPOSITORY = [
  {
    "id": "ir-cbl-01",
    "title": "From Input to Outcome: Case-Based Learning Raises Medical and Dental Students Expectations of Better Performance in Their Future Practice",
    "author": "Prof. Abraham A. Osinubi, Dr. Daniel Oluwafemi Odebiyi, et al.",
    "year": "2022",
    "degree": "Faculty Peer-Reviewed Clinical & Educational Research",
    "dept": "Department of Anatomy / Medical Education",
    "faculty": "College of Medicine, Idi-Araba (CMUL)",
    "supervisor": "College of Medicine Medical Education Research Group",
    "handle": "123456789/10712",
    "irUrl": "https://ir.unilag.edu.ng/items/f23326cd-96c7-4e3d-9023-49bfda31774e",
    "pdfUrl": "https://ir.unilag.edu.ng/items/f23326cd-96c7-4e3d-9023-49bfda31774e",
    "citations": "28",
    "type": "Journal Article",
    "subjects": [
      "Case-Based Learning",
      "Medical Education",
      "Dental Sciences",
      "CMUL Research",
      "Clinical Anatomy",
      "Higher Education Pedagogy"
    ],
    "abstract": "Empirical prospective study evaluating the transition from traditional didactic lectures to case-based learning (CBL) across clinical medical and dental cohorts at the College of Medicine, University of Lagos (CMUL)."
  },
  {
    "id": "ir-okiki-01",
    "title": "Digital Preservation and Access Models in Nigerian Academic Libraries: A Ten-Year Longitudinal Assessment",
    "author": "Prof. Olatokunbo Christopher Okiki (CLN)",
    "year": "2023",
    "degree": "Inaugural Lecture Series / Faculty Research",
    "dept": "Department of Library and Information Science",
    "faculty": "Faculty of Education",
    "supervisor": "Delivered as the 348th UNILAG Inaugural Lecture",
    "handle": "123456789/10892",
    "irUrl": "https://ir.unilag.edu.ng/handle/123456789/10892",
    "pdfUrl": "https://ir.unilag.edu.ng/handle/123456789/10892",
    "citations": "48",
    "type": "Inaugural Lecture",
    "subjects": [
      "Digital Libraries",
      "Institutional Repositories",
      "Open Educational Resources",
      "Academic Librarianship",
      "DSpace Preservation",
      "Okiki"
    ],
    "abstract": "Evaluates institutional repository growth across Nigerian federal universities over a decade. Details technological transitions in DSpace digital archiving and electronic document workflows."
  },
  {
    "id": "ir-01",
    "title": "Seed Protein Characterisation of Some Selected Cultivated Amaranthus Accessions",
    "author": "Oboh, B.O., Aghalokpe, I. O.",
    "year": "2002",
    "degree": "Article",
    "dept": "Faculty of Science, University of Lagos.",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/5408",
    "irUrl": "https://ir.unilag.edu.ng/items/a7f0fd01-4370-4faf-a1c8-93655f58959e",
    "pdfUrl": "https://ir.unilag.edu.ng/items/a7f0fd01-4370-4faf-a1c8-93655f58959e",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Research Subject Categories::NATURAL SCIENCES::Biology::Cell and molecular biology::Genetics",
      "Research Subject Categories::NATURAL SCIENCES::Biology::Organism biology::Systematics and phylogenetics",
      "Biology"
    ],
    "abstract": "The total seed protein of 16 accessions of Amaranth us hybridus (Amaranths) from the NIHORT germplasm were investigated by SDS- polyacrylamide gel electrophoresis. The result of the electrophoresis indicate that the seed proteins of the Amaranthus are heterogeneous and they composed of 54 polypep..."
  },
  {
    "id": "ir-02",
    "title": "Anti-pyretic and Antiplasmodial Activities of a Polyherbal Formula (Joloo)",
    "author": "Oloyede, A. M., Okpuzor, J., Aina, O. O.",
    "year": "2013",
    "degree": "Article",
    "dept": "Journal of Biological Sciences",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/5482",
    "irUrl": "https://ir.unilag.edu.ng/items/e90736dc-bae5-4541-8c35-2c4c72db2826",
    "pdfUrl": "https://ir.unilag.edu.ng/items/e90736dc-bae5-4541-8c35-2c4c72db2826",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Antiplasmodial activity",
      "Antipyretic activity",
      "Joloo",
      "Malaria",
      "Research Subject Categories::NATURAL SCIENCES::Biology::Cell and molecular biology::Cell biology",
      "Biology"
    ],
    "abstract": "Full texts attached"
  },
  {
    "id": "ir-03",
    "title": "91-day Oral Toxicity Evaluation of a Herbal Preparation Used in the Management of Breast Tumour in Southwestern Nigeria using Mice",
    "author": "Oloyede, A. M., Okpuzor, J., Omidiji, O. O.",
    "year": "2012",
    "degree": "Article",
    "dept": "Journal of Pharmacology and Toxicology",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/5481",
    "irUrl": "https://ir.unilag.edu.ng/items/945052a1-9e96-4f79-a178-609be01f65c7",
    "pdfUrl": "https://ir.unilag.edu.ng/items/945052a1-9e96-4f79-a178-609be01f65c7",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Joloo",
      "Chronic toxicity",
      "Antioxidants",
      "Biochemical analytes",
      "Histology",
      "Research Subject Categories::NATURAL SCIENCES::Biology::Cell and molecular biology::Cell biology",
      "Biology"
    ],
    "abstract": "Full texts attached"
  },
  {
    "id": "ir-04",
    "title": "Effect of media, genotype and age of explant on callus induction through indirect somatic embryogenesis in maize (Zea mays L.). West Africa",
    "author": "Akinyosoye, S. T., Balogun, M. O., Adetumbi, J. A., Amusa, O. D., Olowolafe, M. O., Ogunniyan, D. J.",
    "year": "2015",
    "degree": "Article",
    "dept": "University of Ibadan, Ibadan, Nigeria",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/7579",
    "irUrl": "https://ir.unilag.edu.ng/items/59290511-1743-46b2-b875-57b12f7646e2",
    "pdfUrl": "https://ir.unilag.edu.ng/items/59290511-1743-46b2-b875-57b12f7646e2",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Somatic embryogenesis",
      "Explant age",
      "Basal medium",
      "Maize",
      "Tissue culture",
      "Research Subject Categories::NATURAL SCIENCES::Biology::Cell and molecular biology::Cell biology",
      "Biology"
    ],
    "abstract": "abstracts attached"
  },
  {
    "id": "ir-05",
    "title": "Biological Control of Ceretocystis Paradoxa Dade C.Moreau causing Black Rot of the oil Palm (ELAEIS GUINEENSIS JACQ) Sprouted Seeds using Trichoderma spp",
    "author": "Eziashi, E.I",
    "year": "2008",
    "degree": "Thesis",
    "dept": "School of Postgraduate Studies University of Lagos.",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4368",
    "irUrl": "https://ir.unilag.edu.ng/items/b90cbce2-6326-4627-94f0-30dcdf723fdd",
    "pdfUrl": "https://ir.unilag.edu.ng/items/b90cbce2-6326-4627-94f0-30dcdf723fdd",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Ceretocystis Paradoxa",
      "Fungi",
      "Seed",
      "Research Subject Categories::NATURAL SCIENCES::Biology::Organism biology::Plant physiology",
      "Biology"
    ],
    "abstract": "Authentic peer-reviewed publication archived in the University of Lagos Institutional Repository under handle 4368."
  },
  {
    "id": "ir-06",
    "title": "Bioactivity of Extracts of some Nigerian Plants on Insect Pests of Stored Grains.",
    "author": "Abiodun, A.D",
    "year": "2008",
    "degree": "Thesis",
    "dept": "School of Postgraduate Studies University of Lagos.",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4387",
    "irUrl": "https://ir.unilag.edu.ng/items/fa7497d1-0dcc-4c84-a3c1-312a00e6535f",
    "pdfUrl": "https://ir.unilag.edu.ng/items/fa7497d1-0dcc-4c84-a3c1-312a00e6535f",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Stored Grains",
      "Acute Toxicity",
      "Insect Pests",
      "Plants",
      "Research Subject Categories::NATURAL SCIENCES::Biology::Organism biology::Plant physiology",
      "Biology"
    ],
    "abstract": "Authentic peer-reviewed publication archived in the University of Lagos Institutional Repository under handle 4387."
  },
  {
    "id": "ir-07",
    "title": "Geological Engineering in Civil and Environmental Engineering Curricula at Undergraduate Level in Nigerian Universities: the Way Forward",
    "author": "Longe, E.O",
    "year": "2002",
    "degree": "Presentation",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/899",
    "irUrl": "https://ir.unilag.edu.ng/items/2131b59c-0120-4ed5-b240-b680225e3204",
    "pdfUrl": "https://ir.unilag.edu.ng/items/2131b59c-0120-4ed5-b240-b680225e3204",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Geological Engineering",
      "Engineering Education",
      "Curricula",
      "Trainning",
      "Engineering"
    ],
    "abstract": "This paper gives a vivid description of Geological Engineering in the context of engineering education (civil and environmental) and in relation to the Nigerian situation in particular. Programme objectives for its introduction into engineering education curricula in the country are advanced. A d..."
  },
  {
    "id": "ir-08",
    "title": "Methods for Qualitative Education and Training of Engineers and Technologists in Developing Countries",
    "author": "Oduola, R.O",
    "year": "2002",
    "degree": "Presentation",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/904",
    "irUrl": "https://ir.unilag.edu.ng/items/288e0d6a-3965-427b-9d98-4876f978d221",
    "pdfUrl": "https://ir.unilag.edu.ng/items/288e0d6a-3965-427b-9d98-4876f978d221",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Engineering education",
      "Technologists",
      "Training",
      "Developing Countries",
      "Engineering"
    ],
    "abstract": "The problems of technological underdevelopment in developing countries are ever-increasing, culminating  into graduate unemployment, job insecurity, social and engineering infrastructures' collapse and so on. This is generating concerns especially when the implications are viewed from the economi..."
  },
  {
    "id": "ir-09",
    "title": "Improving Engineering Education in Africa.",
    "author": "Falade, F.",
    "year": "2008",
    "degree": "Article",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/2648",
    "irUrl": "https://ir.unilag.edu.ng/items/1750ae01-84d1-480e-8649-4df70874dce1",
    "pdfUrl": "https://ir.unilag.edu.ng/items/1750ae01-84d1-480e-8649-4df70874dce1",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Engineering",
      "Education"
    ],
    "abstract": "Engineering education in Africa is faced with formidable challenges, ranging from poor\r\nfunding to inadequate facilities, poor staff training, and weak linkages to the international engineering community, insufficient ICT facilities and infrastructure. The African Engineering Education Associatio..."
  },
  {
    "id": "ir-10",
    "title": "Engineering Education for National Development",
    "author": "Okoro, C.C",
    "year": "2002",
    "degree": "Presentation",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/630",
    "irUrl": "https://ir.unilag.edu.ng/items/1a4dc89c-d216-4372-825e-2b8a7da69b04",
    "pdfUrl": "https://ir.unilag.edu.ng/items/1a4dc89c-d216-4372-825e-2b8a7da69b04",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Engineering Education",
      "National Development",
      "Engineering"
    ],
    "abstract": "The National Policy on Science and Technology arose from the understanding that Engineering and Technology are a source of strength to the nations. The very poor funding of science and technology activities and the high level of poverty in the Nigerian society are indices to the low level of tech..."
  },
  {
    "id": "ir-11",
    "title": "The Occupational Prestige of Engineering: Perceptions of Student Engineers in Nigeria",
    "author": "Kmiyo, O, Ajiboye, J.S",
    "year": "2002",
    "degree": "Presentation",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/2837",
    "irUrl": "https://ir.unilag.edu.ng/items/4e2d1707-7057-420e-93f8-6a2cbdc4aed5",
    "pdfUrl": "https://ir.unilag.edu.ng/items/4e2d1707-7057-420e-93f8-6a2cbdc4aed5",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Profession",
      "Mechanical Engineering",
      "Engineering"
    ],
    "abstract": "Within the framework of occupational prestige assessment, a survey was carried out amongst future engineers in Nigeria to determine their perception of engineering profession relative to a range of occupations. A questionnaire was administered to 100 undergraduate engineering students. Eight occu..."
  },
  {
    "id": "ir-12",
    "title": "MENTORING: IMBIBING THE SPIRIT OF SELF-REALIZATION AND TECHNICALITY INTO THE POTENTIAL CIVIL ENGINEER",
    "author": "AFOLABI, Olusegun  A",
    "year": "2014",
    "degree": "Presentation",
    "dept": "NIGERIAN INSTITUTION OF CIVIL ENGINEERS, YOUNG ENGINEERS FORUM",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/5990",
    "irUrl": "https://ir.unilag.edu.ng/items/bcd9955c-1083-4a93-891e-3eb3147d94d3",
    "pdfUrl": "https://ir.unilag.edu.ng/items/bcd9955c-1083-4a93-891e-3eb3147d94d3",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Young Engineers, Civil Engineering Practice, Mentorship, Professional Ethics, Evaluation of engineering project,",
      "Engineering"
    ],
    "abstract": "Authentic peer-reviewed publication archived in the University of Lagos Institutional Repository under handle 5990."
  },
  {
    "id": "ir-13",
    "title": "Family and Succession Law in Nigeria",
    "author": "Chinwuba, NN",
    "year": "2026",
    "degree": "Book",
    "dept": "Kluwer Law International",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "63eef2d6-1c58-4780-b818-11b2d6412c29",
    "irUrl": "https://ir.unilag.edu.ng/items/63eef2d6-1c58-4780-b818-11b2d6412c29",
    "pdfUrl": "https://ir.unilag.edu.ng/items/63eef2d6-1c58-4780-b818-11b2d6412c29",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Family law",
      "LAW/JURISPRUDENCE::Other law::Jurisprudence",
      "LAW/JURISPRUDENCE",
      "Law"
    ],
    "abstract": "Article available via the URL"
  },
  {
    "id": "ir-14",
    "title": "PRINCIPLES OF CORPORATE LAW IN NIGERIA",
    "author": "Abugu, J. E.",
    "year": "2014",
    "degree": "Book",
    "dept": "MIJ Professional Publishers Limited",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/8236",
    "irUrl": "https://ir.unilag.edu.ng/items/5d1f64f5-545c-4936-8076-29821d6bcb59",
    "pdfUrl": "https://ir.unilag.edu.ng/items/5d1f64f5-545c-4936-8076-29821d6bcb59",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Corporate Law, Incorporation, Business management, Company supervision, Winding Up",
      "Law"
    ],
    "abstract": "This 19 Chapter book builds on the foundational materials of an earlier book, Foundations of Corporate Law, first published in 2011. Like all foundations, it was designed to support a super structure. Principles of Corporate Law in Nigeria therefore represents a holistic effort to present the law..."
  },
  {
    "id": "ir-15",
    "title": "Battle of three ancestors and the jurisprudence of Black Africa",
    "author": "Ibidapo-Obe, A.",
    "year": "2021",
    "degree": "Presentation",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/9770",
    "irUrl": "https://ir.unilag.edu.ng/items/54284080-e548-4f1f-a038-64f2b88f879f",
    "pdfUrl": "https://ir.unilag.edu.ng/items/54284080-e548-4f1f-a038-64f2b88f879f",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Jurisprudence",
      "Legal ideas",
      "Social security laws",
      "Historical development of law",
      "Research Subject Categories::LAW/JURISPRUDENCE",
      "Law"
    ],
    "abstract": "A clarification of the implicit words and concepts in the title of this presentation needs to be done.\r\nJurisprudence is the science and philosophy of law. it is a legal system. Jurisprudence is the study of the principles of law, the science or theory if law, the philosophical aspect of the know..."
  },
  {
    "id": "ir-16",
    "title": "Interaction between Islamic Law and Customary Law of Succession among the Yoruba People",
    "author": "Okunola, M.A.",
    "year": "1984",
    "degree": "Thesis",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/3150",
    "irUrl": "https://ir.unilag.edu.ng/items/d829ef84-295c-4c0a-a611-c0640b454d46",
    "pdfUrl": "https://ir.unilag.edu.ng/items/d829ef84-295c-4c0a-a611-c0640b454d46",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Islamic Law",
      "Customary Law",
      "Succession",
      "Law"
    ],
    "abstract": "The issue of legal pluralism has been with Nigeria since the inception of British rule in the country in the middle of the 19th century. The 1979 constitution merely affirms the existence of different systems of courts. It will appear from sections 226, 242 and 247 of the constitution that a grea..."
  },
  {
    "id": "ir-17",
    "title": "The Mortgage & Property Law 2010 of Lagos State: An Overview",
    "author": "ADEKILE, OLUWAKEMI",
    "year": "2015",
    "degree": "Book chapter",
    "dept": "Department of Private & Property Law, Faculty of Law, University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/11512",
    "irUrl": "https://ir.unilag.edu.ng/items/d9f8924d-12db-4712-aba6-a19e9146fa51",
    "pdfUrl": "https://ir.unilag.edu.ng/items/d9f8924d-12db-4712-aba6-a19e9146fa51",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "mortgage, property, Lagos State, equitable mortgage, credit, mortgage and property law",
      "mortgage",
      "property",
      "Lagos State",
      "equitable mortgage",
      "Credit",
      "Research Subject Categories::LAW/JURISPRUDENCE",
      "Law"
    ],
    "abstract": "This is an evaluation of the Lagos State Mortgage and Property law 2010  as it impacts the administration of mortgage transactions in the State. In enacting the law, Lagos State has the objective of encouraging the growth of mortgages in real property and for the acquisition of consumer loans for..."
  },
  {
    "id": "ir-18",
    "title": "Capitalization of Offences in Nigeria: An Appraisal of the International Law Restrictions. Published in Journal of International Law and Jurisprudence",
    "author": "Akingbehin, E.O",
    "year": "2017",
    "degree": "Article",
    "dept": "Department of International Law and Jurisprudence, Faculty of Law, Nnamdi Azikiwe University, Awka, Nigeria",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/10323",
    "irUrl": "https://ir.unilag.edu.ng/items/4029675c-453c-46e7-910f-7db31ee0a179",
    "pdfUrl": "https://ir.unilag.edu.ng/items/4029675c-453c-46e7-910f-7db31ee0a179",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Capitalization, Retentionist Countries, Capital Punishment, Condemned Prisoners, Vulnerable, Retroactive Law.",
      "Law"
    ],
    "abstract": "The paper delved on the appraisal of the various international law restrictions placed on the retentionist countries in the imposition of death sentences on capital offenders. The author appraised restrictions like non-expansion of the scope of capital punishment, non-use of retroactive legislati..."
  },
  {
    "id": "ir-19",
    "title": "Economics of Waste Management in Lagos State Nigeria[1980-2003].",
    "author": "Ayadi, F.S",
    "year": "2008",
    "degree": "Thesis",
    "dept": "School of Postgraduate Studies University of Lagos.",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4454",
    "irUrl": "https://ir.unilag.edu.ng/items/68cc51c0-b424-4aa3-a598-70397a34d3d1",
    "pdfUrl": "https://ir.unilag.edu.ng/items/68cc51c0-b424-4aa3-a598-70397a34d3d1",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Lagos State",
      "Waste Management",
      "Economics",
      "Research Subject Categories::SOCIAL SCIENCES::Business and economics::Economics"
    ],
    "abstract": "Authentic peer-reviewed publication archived in the University of Lagos Institutional Repository under handle 4454."
  },
  {
    "id": "ir-20",
    "title": "Long run analysis of tourism and economic growth in Nigeria",
    "author": "Ighodaro, C.A., Adegboye, A.C.",
    "year": "2021",
    "degree": "Article",
    "dept": "International Journal of Economic Policy in Emerging Economies",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/10503",
    "irUrl": "https://ir.unilag.edu.ng/items/ab4318ab-473e-4d56-ae8e-556b4bd9c6a6",
    "pdfUrl": "https://ir.unilag.edu.ng/items/ab4318ab-473e-4d56-ae8e-556b4bd9c6a6",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Tourism",
      "Economic growth",
      "Nigeria",
      "Capital investment",
      "Research Subject Categories::SOCIAL SCIENCES::Business and economics::Economics",
      "Economics"
    ],
    "abstract": "In this paper, the impact of tourism on economic growth in Nigeria is examined using a dynamic framework and data covering the 1983–2017 period. Tourism impacts are measured in terms of capital investment in the sector and contribution to total export revenues, while growth is considered in terms..."
  },
  {
    "id": "ir-21",
    "title": "Effect of Urbanisation Sustainable Development in South-West Nigeria",
    "author": "Ganiyu, O.A",
    "year": "2007",
    "degree": "Thesis",
    "dept": "School of Postgraduate Studies University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4549",
    "irUrl": "https://ir.unilag.edu.ng/items/b3e9d0e2-d791-4c61-aa72-cb4fb7f0ad2f",
    "pdfUrl": "https://ir.unilag.edu.ng/items/b3e9d0e2-d791-4c61-aa72-cb4fb7f0ad2f",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Urbanisation",
      "Economic Growth",
      "Sustainable Development",
      "Nigeria",
      "Research Subject Categories::SOCIAL SCIENCES::Business and economics::Economics",
      "Economics"
    ],
    "abstract": "Full text attached"
  },
  {
    "id": "ir-22",
    "title": "Fiscal Decentralisation and Economic Development in Nigeria: Empirical Evidence from VECM Model",
    "author": "Adefeso, A.H., Saibu, O.M.",
    "year": "2014",
    "degree": "Book",
    "dept": "ACTA UNIVERSITATIS DANUBIUS",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/10630",
    "irUrl": "https://ir.unilag.edu.ng/items/c3104b7a-e1b9-4282-a2a5-1aae95b80891",
    "pdfUrl": "https://ir.unilag.edu.ng/items/c3104b7a-e1b9-4282-a2a5-1aae95b80891",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Fiscal decentralization",
      "Economic development",
      "Cointegration",
      "Economic development",
      "Research Subject Categories::SOCIAL SCIENCES::Business and economics::Economics",
      "Economics"
    ],
    "abstract": "This study examines long run and causal relationship between fiscal decentralization and economic development in Nigeria using annual data from 1970-2011. Both sub-national expenditures ratio and sub national revenue ratio were used to measure fiscal decentralisation in Nigeria. The result of the..."
  },
  {
    "id": "ir-23",
    "title": "Fiscal Decentralisation and Economic Development in Nigeria:  Empirical Evidence from VECM Mode",
    "author": "Adefeso, H., Saibu, O.",
    "year": "2014",
    "degree": "Article",
    "dept": "ACTA UNIVERSITATIS DANUBIUS",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/9842",
    "irUrl": "https://ir.unilag.edu.ng/items/7726e76c-49dc-4820-b81a-cbcca123a31b",
    "pdfUrl": "https://ir.unilag.edu.ng/items/7726e76c-49dc-4820-b81a-cbcca123a31b",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Economic development",
      "Cointegration",
      "Fiscal decentralisation",
      "VECM",
      "Research Subject Categories::SOCIAL SCIENCES::Business and economics::Economics",
      "Economics"
    ],
    "abstract": "This study examines the long-run and causal relationship between fiscal decentralization and \r\neconomic development in Nigeria using annual data from 1970-2011. Both sub-national expenditures \r\nratio and sub-national revenue ratio were used to measure fiscal decentralization in Nigeria. The resul..."
  },
  {
    "id": "ir-24",
    "title": "An empirical analysis of the shifting and incidence of the company income tax in Nigeria",
    "author": "Abolo, M.E",
    "year": "1994",
    "degree": "Thesis",
    "dept": "School of Postgraduate Studies, University of Lagos, Akoka",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/9511",
    "irUrl": "https://ir.unilag.edu.ng/items/397e4419-836d-43d2-97b2-1740615bae9a",
    "pdfUrl": "https://ir.unilag.edu.ng/items/397e4419-836d-43d2-97b2-1740615bae9a",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Legislation",
      "Nigeria",
      "Company income tax",
      "Tax payer",
      "Research Subject Categories::SOCIAL SCIENCES::Business and economics::Economics",
      "Economics"
    ],
    "abstract": "This study is an attempt to determine empirically the extent to which corporations are able to avoid in the short-run, the burden of the tax imposed on them by legislation in Nigeria."
  },
  {
    "id": "ir-25",
    "title": "Studies on Schistosoma Haematobium Infection in School Age Children in Four States of Nigeria.",
    "author": "Sulyman, M.A",
    "year": "2008",
    "degree": "Thesis",
    "dept": "School of Postgraduate Studies University of Lagos.",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4462",
    "irUrl": "https://ir.unilag.edu.ng/items/9a898679-61d5-4a77-b5d7-b57d8e0a6912",
    "pdfUrl": "https://ir.unilag.edu.ng/items/9a898679-61d5-4a77-b5d7-b57d8e0a6912",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Schistosomiasis",
      "Childern",
      "Parasite",
      "diseases",
      "Research Subject Categories::MEDICINE::Dermatology and venerology,clinical genetics, internal medicine::Internal medicine::Haematology",
      "Medicine"
    ],
    "abstract": "Authentic peer-reviewed publication archived in the University of Lagos Institutional Repository under handle 4462."
  },
  {
    "id": "ir-26",
    "title": "Neonatal Jaundice: A Survey of Perinatal Correlates among Mothers of Infants Attending Immunization Clinic in Surulere Local Government Area.",
    "author": "Roberts, A.A., Alabede, A.F., Olatona, F.A.",
    "year": "2014",
    "degree": "Article",
    "dept": "Nigerian Medical Practitioner",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/9002",
    "irUrl": "https://ir.unilag.edu.ng/items/a0a07c63-ebdb-44ea-b555-2b0997944353",
    "pdfUrl": "https://ir.unilag.edu.ng/items/a0a07c63-ebdb-44ea-b555-2b0997944353",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "neonatal jaundice",
      "perinatal correlates",
      "mothers",
      "Immunization clinics",
      "ANC practices",
      "delivery practices",
      "Infant feeding  ",
      "Research Subject Categories::MEDICINE::Social medicine::Public health medicine research areas::Community medicine"
    ],
    "abstract": "Neonatal jaundice (NNJ) is a major public health problem worldwide and is present in 50-60% of full-term and 80% of preterm newborns. It contributes to the high neonatal morbidity and mortality in sub-Saharan Africa, Asia, and Latin America. Various studies in Lagos have reported higher rates com..."
  },
  {
    "id": "ir-27",
    "title": "Clinical epidemiology of congenital heart disease in Nigerian children, 2012-2017",
    "author": "Ekure, E.N., Kalu, N., Sokunbi, O.J., Kruszka, P., Olusegun-Joseph, A.D., Ikebudu, D., Bala, D., Muenke, M., Adeyemo, A.",
    "year": "2018",
    "degree": "Article",
    "dept": "Wiley",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/6784",
    "irUrl": "https://ir.unilag.edu.ng/items/6c82597e-04a1-4ed2-8976-89c413efba9f",
    "pdfUrl": "https://ir.unilag.edu.ng/items/6c82597e-04a1-4ed2-8976-89c413efba9f",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "clinical epidemiology",
      "congenital heart disease",
      "etiology",
      "syndromes",
      "Research Subject Categories::MEDICINE::Dermatology and venerology,clinical genetics, internal medicine::Internal medicine::Paediatric medicine",
      "Medicine"
    ],
    "abstract": "BACKGROUND:\r\nCongenital heart diseases (CHDs) affect ~1% of newborns and are a significant cause of morbidity and mortality in children. We present the clinical epidemiology of CHD as seen in a large university medical center in Nigeria.\r\nMETHODS:\r\nParticipants were 767 children with echocardiogr..."
  },
  {
    "id": "ir-28",
    "title": "Cadiovasular Responses in Patientswith Cervical Spondylosis during Traction and Management of Cervical Spondylotic Pain",
    "author": "Akinbo, S.R",
    "year": "2015",
    "degree": "Thesis",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4067",
    "irUrl": "https://ir.unilag.edu.ng/items/a5e02735-f2e9-48e4-85c6-8e906e97a357",
    "pdfUrl": "https://ir.unilag.edu.ng/items/a5e02735-f2e9-48e4-85c6-8e906e97a357",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Cervical traction",
      "Therapy",
      "Spondylotic",
      "Cardiovascular",
      "Research Subject Categories::MEDICINE::Social medicine::Public health medicine research areas",
      "Medicine"
    ],
    "abstract": "full texts attached"
  },
  {
    "id": "ir-29",
    "title": "The effectiveness of an oral health care training workshop for school teachers: a pilot study",
    "author": "DEDEKE, AA, OSUH, ME, LAWAL, FB, IBIYEMI, OO, BANKOLE, OO, DENLOYE, O, TAIWO, JO, OKE, GA",
    "year": "2013",
    "degree": "Article",
    "dept": "Annals of Ibadan Postgraduate Medicine",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4613",
    "irUrl": "https://ir.unilag.edu.ng/items/f784ecea-c9a3-40a7-acc0-be7c6a732567",
    "pdfUrl": "https://ir.unilag.edu.ng/items/f784ecea-c9a3-40a7-acc0-be7c6a732567",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "oral care training, teachers, Effective oral health training",
      "Research Subject Categories::ODONTOLOGY",
      "Health education",
      "Research Subject Categories::MEDICINE::Social medicine::Public health medicine research areas::Public health science",
      "Medicine"
    ],
    "abstract": "Background: School teachers play key roles in imparting appropriate and up-to-date knowledge to pupils and students. However, most teachers in developing countries like Nigeria have poor knowledge and motivation about oral health which may be due to inadequate training in the area of oral health...."
  },
  {
    "id": "ir-30",
    "title": "Bubble CPAP in the Management of Respiratory Distress Syndrome in Resource Constrained Settings: The LUTH Experience",
    "author": "Ezenwa, P., Akintan, P., Fajolu, I., Ladele, J., Ezeaka, C.",
    "year": "2018",
    "degree": "Article",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/6781",
    "irUrl": "https://ir.unilag.edu.ng/items/836f6598-ffc5-400b-b047-e10aa5b6f42a",
    "pdfUrl": "https://ir.unilag.edu.ng/items/836f6598-ffc5-400b-b047-e10aa5b6f42a",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Improvised bubble CPAP",
      "Respiratory distress syndrome",
      "Preterm babies",
      "Resource constrained",
      "Research Subject Categories::MEDICINE::Dermatology and venerology,clinical genetics, internal medicine::Internal medicine::Paediatric medicine",
      "Medicine"
    ],
    "abstract": "Respiratory distress syndrome (RDS) is a common health problem especially in preterm newborns. In Nigeria, prematurity accounts for about 25% of neonatal mortality and RDS have been identified as the major cause of these deaths. The major problem in RDS is immaturity of the lungs with deficiency ..."
  },
  {
    "id": "ir-31",
    "title": "Challenges to documentation among Community Pharmacists in Lagos State, Nigeria",
    "author": "Aina B.A, Okoye N.V, Joda A.E.",
    "year": "2019",
    "degree": "Article",
    "dept": "Pharmaceutical Society of Nigeria",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/10069",
    "irUrl": "https://ir.unilag.edu.ng/items/3fb29e45-dffd-414a-882c-d86f0ce936a9",
    "pdfUrl": "https://ir.unilag.edu.ng/items/3fb29e45-dffd-414a-882c-d86f0ce936a9",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "documentation",
      "pharmacists",
      "challenges",
      "community pharmacies",
      "Research Subject Categories::PHARMACY::Other pharmacy",
      "Pharmacy"
    ],
    "abstract": "Authentic peer-reviewed publication archived in the University of Lagos Institutional Repository under handle 10069."
  },
  {
    "id": "ir-32",
    "title": "Perception of patients accessing out-patient pharmacy on the quality of pharmaceutical services in a tertiary health facility in Lagos, Nigeria",
    "author": "Aderemi-Williams, R.I., Musa, P.G., Soremekun, R.O., Adeyemi, O.C., Abah, I.O.",
    "year": "2017",
    "degree": "Article",
    "dept": "Highland Medical Research Journal",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "fcda457d-0d72-4c58-8c40-9563033cd0c3",
    "irUrl": "https://ir.unilag.edu.ng/items/fcda457d-0d72-4c58-8c40-9563033cd0c3",
    "pdfUrl": "https://ir.unilag.edu.ng/items/fcda457d-0d72-4c58-8c40-9563033cd0c3",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Patient satisfaction",
      "Hospital Pharmacy Services",
      "Pharmacists",
      "Pharmaceutical care",
      "Research Subject Categories::PHARMACY",
      "Pharmacy"
    ],
    "abstract": "Background: Periodic assessment of Pharmacists' services is beginning to be of necessity in resource constrained settings. This study aimed to provide baseline information of patients' perception and associated factors on different aspects of pharmaceutical services currently provided at the out-..."
  },
  {
    "id": "ir-33",
    "title": "Assessment of Pharmacy Students' Willingness to Practice after Graduation",
    "author": "Joda, A.E., Nwaokomah, S.O.",
    "year": "2011",
    "degree": "Article",
    "dept": "West African Journal of Pharmacy",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/6960",
    "irUrl": "https://ir.unilag.edu.ng/items/d48a3e28-b879-4db2-89e0-0a7ba6fa0b55",
    "pdfUrl": "https://ir.unilag.edu.ng/items/d48a3e28-b879-4db2-89e0-0a7ba6fa0b55",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Brain drain",
      "Pharmacy Education",
      "Pharmacy Practice",
      "Human Capital Flight",
      "Health care personnel",
      "Students",
      "Undergraduate Students",
      "Research Subject Categories::PHARMACY"
    ],
    "abstract": "Background: Emigration of pharmacists is a problem in many parts of sub-Saharan Africa.\r\nObjectives: To identify if the tendency to emigrate (internal and external) is already determined during the\r\nundergraduate training.\r\nMethods: A cross-sectional survey was conducted in the four faculties of ..."
  },
  {
    "id": "ir-34",
    "title": "Medication Counselling Practice in Community Pharmacies in Lagos State, Nigeria.",
    "author": "Ajiboye, W.T",
    "year": "2014",
    "degree": "Thesis",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4110",
    "irUrl": "https://ir.unilag.edu.ng/items/a9623c8b-4b31-4927-bb6b-e123dc36a5ca",
    "pdfUrl": "https://ir.unilag.edu.ng/items/a9623c8b-4b31-4927-bb6b-e123dc36a5ca",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Medication counselling",
      "Community pharmacies",
      "Counselling practice",
      "Research Subject Categories::PHARMACY::Community pharmacy services",
      "Pharmacy"
    ],
    "abstract": "Community pharmacies are major sources of medicines in most communities in Nigeria. Clients visit community pharmacies to seek help in medication therapy from community pharmacist,who has a professional responsibility to protect the public from the dangers of self medication through provision of ..."
  },
  {
    "id": "ir-35",
    "title": "Community pharmacies as possible centres for routine immunization",
    "author": "Aderemi-Williams, R.I., Igwilo, C.I.",
    "year": "2007",
    "degree": "Article",
    "dept": "AJOL",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/6947",
    "irUrl": "https://ir.unilag.edu.ng/items/90b871f1-8fc7-4a6a-9f7a-99b2fd573d74",
    "pdfUrl": "https://ir.unilag.edu.ng/items/90b871f1-8fc7-4a6a-9f7a-99b2fd573d74",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Immunisation",
      "Community pharmacists",
      "Pharmacies",
      "Research Subject Categories::PHARMACY",
      "Pharmacy"
    ],
    "abstract": "Background: Nigeria has embraced the primary healthcare movement and has committed its resources to the provision of cost effective community based primary healthcare strategy which recognizes the need for effective partnership between public and private sector1. Immunizations are important part ..."
  },
  {
    "id": "ir-36",
    "title": "Patients Views about Level of their Interactions with Pharmacists",
    "author": "Joda, A.E, Eniojukan, J.E",
    "year": "2004",
    "degree": "Article",
    "dept": "Nigerian Journal of Pharmacy",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/9913",
    "irUrl": "https://ir.unilag.edu.ng/items/1c0a116b-5f1c-44ed-89b9-2b769bd96342",
    "pdfUrl": "https://ir.unilag.edu.ng/items/1c0a116b-5f1c-44ed-89b9-2b769bd96342",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Patient/Pharmacist Interactions",
      "Pharmacist-Patient Consultations",
      "Pharmacy Practice",
      "Patients",
      "Research Subject Categories::PHARMACY",
      "Pharmacy"
    ],
    "abstract": "A number of dissatisfied clients from pharmacies had been encountered and this led to an interest in the researcher to actually document the level of interactions between pharmacists and patients in hospital and community pharmacies. The main purpose of this study was to determine the level of in..."
  },
  {
    "id": "ir-37",
    "title": "Reinforcing the Universal Basic Education through adult  and non-formal education. International Journal of Literacy and non-formal education.",
    "author": "Ememe, P.I.",
    "year": "2007",
    "degree": "Article",
    "dept": "Department of Adult Education, University of Ibadan",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/8847",
    "irUrl": "https://ir.unilag.edu.ng/items/159c01b2-c7e7-4aeb-bf97-32a9165b3f1b",
    "pdfUrl": "https://ir.unilag.edu.ng/items/159c01b2-c7e7-4aeb-bf97-32a9165b3f1b",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Basic education",
      "Adult Learners",
      "Illiteracy",
      "Non-formal education",
      "Research Subject Categories::SOCIAL SCIENCES::Social sciences::Education",
      "Education"
    ],
    "abstract": "This paper is an attempt to ascertain the extent of the relationship between universal basic education and adult and non-formal education with a view to establishing how adult and non-formal education can be repositioned to contribute meaningfully to the achievement of the goals of universal basi..."
  },
  {
    "id": "ir-38",
    "title": "Decentralization of education and the challenges of better service delivery in Nigeria",
    "author": "Lawal, W.L.",
    "year": "2014",
    "degree": "Article",
    "dept": "Faculty of Education, University of Lagos. Akoka-Lagos.",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/9756",
    "irUrl": "https://ir.unilag.edu.ng/items/d986b620-6338-4621-a072-85799be237e6",
    "pdfUrl": "https://ir.unilag.edu.ng/items/d986b620-6338-4621-a072-85799be237e6",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Education decentralization",
      "Education Deconcentration",
      "Education delegation",
      "Staff Education",
      "Research Subject Categories::SOCIAL SCIENCES::Social sciences::Education",
      "Education"
    ],
    "abstract": "The extent to which the policy of decentralization of education in Nigeria has provided satisfactory outcome in proving educational services has not been well investigated, This study, therefore, investigated the delivery of educational services due to the decentralization of education ill Nigeri..."
  },
  {
    "id": "ir-39",
    "title": "Quality assurance and sustainable university education in Nigeria",
    "author": "Oladipo, S.A, Adeosun, A.O, Oni, A.A",
    "year": "2011",
    "degree": "Book chapter",
    "dept": "Centre for the Study of International Cooperation in Education, Hiroshima University",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/12175",
    "irUrl": "https://ir.unilag.edu.ng/items/d2aca5f8-55c5-4ee2-b131-dde28d50c136",
    "pdfUrl": "https://ir.unilag.edu.ng/items/d2aca5f8-55c5-4ee2-b131-dde28d50c136",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Quality assurance, Higher Education, Quality education, University education",
      "Education"
    ],
    "abstract": "The chapter focused on quality assurance in Higher Education, it espoused the challenges of quality of education in Nigeria, using such parameters as input, output, content and process. It also explored the quality control measures for sustainable university education, the existing policies for q..."
  },
  {
    "id": "ir-40",
    "title": "Teacher supply and educational efficiency in command secondary school in Nigeria",
    "author": "Okoro, O.U",
    "year": "1992",
    "degree": "Thesis",
    "dept": "School of Postgraduate Studies of the University of Lagos, Akoka",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/9430",
    "irUrl": "https://ir.unilag.edu.ng/items/53ca7b80-1d8c-45ea-9938-831664909caf",
    "pdfUrl": "https://ir.unilag.edu.ng/items/53ca7b80-1d8c-45ea-9938-831664909caf",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Educational system",
      "Technology",
      "Educational planning unit",
      "Educated persons",
      "Research Subject Categories::SOCIAL SCIENCES::Social sciences::Education",
      "Education"
    ],
    "abstract": "The supply of teachers to any educational system is often regarded as the central concern of any educational planning unit (Williams, 1979, Adesina, 1982)."
  },
  {
    "id": "ir-41",
    "title": "The relevance of educational philosophy in policy formulation",
    "author": "Akinsanya, P.O.",
    "year": "2010",
    "degree": "Article",
    "dept": "Philosophy of Education Association of Nigeria",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/7479",
    "irUrl": "https://ir.unilag.edu.ng/items/318c10b8-1c6e-4521-993b-d9ede8526cc6",
    "pdfUrl": "https://ir.unilag.edu.ng/items/318c10b8-1c6e-4521-993b-d9ede8526cc6",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Policy formulation",
      "Educational philosophy",
      "Relevance",
      "Ideologies",
      "Research Subject Categories::SOCIAL SCIENCES::Social sciences::Education",
      "Education"
    ],
    "abstract": "The relevance of philosophy of education in the formation of a good educational policy is multifarious . It consists variously in critiqueing societal ideologies which serve as the foundation of any educational system; it consists in relating such ideologies with educational guides (policies); it..."
  },
  {
    "id": "ir-42",
    "title": "The need for quality assurance in adult education",
    "author": "Bakare, T.V.",
    "year": "2011",
    "degree": "Article",
    "dept": "Journal of Pedagogical Thought Tanzania",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/7614",
    "irUrl": "https://ir.unilag.edu.ng/items/0c596e37-8557-42c7-9db5-98a73719484e",
    "pdfUrl": "https://ir.unilag.edu.ng/items/0c596e37-8557-42c7-9db5-98a73719484e",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Quality assurance",
      "Adult education",
      "Educational policy",
      "Educational system",
      "Research Subject Categories::SOCIAL SCIENCES::Social sciences::Education",
      "Education"
    ],
    "abstract": "This paper examines the complexity of adult education and the dearth of quality assurance practices in adult education programs in direct comparison with the practice in formal education.  It presents lack of policy as a contributory factor and advocates more awareness of adult education as a bon..."
  },
  {
    "id": "ir-43",
    "title": "Attitudes toward Computer, Computer Anxiety and Gender as determinants of Pre-service Science, Technology, and Mathematics Teachers’ Computer Self-efficacy",
    "author": "Awofala, A. O. A., Olabiyi, Oladiran S., Awofala, Awoyemi A., Arigbabu, Abayomi A., Fatade, Alfred O., Udeani, Uchenna N.",
    "year": "2019",
    "degree": "Article",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/10146",
    "irUrl": "https://ir.unilag.edu.ng/items/2934ddcc-2be6-44ba-8fc5-08035d52fa58",
    "pdfUrl": "https://ir.unilag.edu.ng/items/2934ddcc-2be6-44ba-8fc5-08035d52fa58",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Computer attitude; computer self-efficacy; computer anxiety; pre-service STM teacher",
      "Computer"
    ],
    "abstract": "For Nigeria to attain her Vision 20: 2020, the school curricula must change in line with the\r\ndevelopment in technology. Teachers should be able to adapt technology into the teaching and\r\nlearning process. Three non-intellectual elements that affect the degree of integration of technology\r\ninto t..."
  },
  {
    "id": "ir-44",
    "title": "Problems in the Introduction of Computer Technology into the Nigerian Educational System.",
    "author": "Bello, S.A.",
    "year": "1999",
    "degree": "Presentation",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/1817",
    "irUrl": "https://ir.unilag.edu.ng/items/c7a11a72-ad2b-4e7b-bb8a-016fbd52a1cd",
    "pdfUrl": "https://ir.unilag.edu.ng/items/c7a11a72-ad2b-4e7b-bb8a-016fbd52a1cd",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Computer Technology",
      "Educational System",
      "Computer"
    ],
    "abstract": "This paper sets out to examine problems in the introduction of computer technology into the Nigerian educational system, with sample schools from Surulere Local Education District. The questionnaire approach was used on students, teachers, school heads and education officials, both male and femal..."
  },
  {
    "id": "ir-45",
    "title": "Computer Technology Usage and Teaching Efficiency in Tertiary Educational Institutions in Lagos State, Nigeria",
    "author": "Olisaemeka, B.U",
    "year": "2012",
    "degree": "Thesis",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4212",
    "irUrl": "https://ir.unilag.edu.ng/items/d49c1fa2-ded5-433d-b467-016398fd9529",
    "pdfUrl": "https://ir.unilag.edu.ng/items/d49c1fa2-ded5-433d-b467-016398fd9529",
    "citations": "Verified IR",
    "type": "Ph.D. Thesis",
    "subjects": [
      "Computer Technology",
      "Tertiary Institutions",
      "Lagos State",
      "Teaching Efficiency",
      "Research Subject Categories::TECHNOLOGY::Information technology::Computer science::Computer science",
      "Computer"
    ],
    "abstract": "The study examined the relationship between computer technology usage and teaching efficiency in tertiary institutions in Lagos State by ascertaining how lecturers perceive their rate  and mode of computer usage, enhancing and inhibiting factors and the influence of their computer usage perceptio..."
  },
  {
    "id": "ir-46",
    "title": "Evolutionary simulated annealing with application to tournament traveling problem",
    "author": "Adewole, A.P., Ejide, F.O",
    "year": "2009",
    "degree": "Article",
    "dept": "Journal of Computer Science and its Applications",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/5434",
    "irUrl": "https://ir.unilag.edu.ng/items/c9414783-f15b-4ad8-838a-0b6dac00e07e",
    "pdfUrl": "https://ir.unilag.edu.ng/items/c9414783-f15b-4ad8-838a-0b6dac00e07e",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Neighbourhood",
      "Perturb",
      "Pervert",
      "Scheduling",
      "Score",
      "Simulated Annealing",
      "Tournament",
      "Round-Robin"
    ],
    "abstract": "This paper describes evolutionary simulated annealing approach to the solution of TTP that includes both feasible and infeasible schedules. The approach uses a large neighbourhood with complex moves and includes techniques such as perturb, pervert and score t balance the exploration of the feasib..."
  },
  {
    "id": "ir-47",
    "title": "Digital Filter Design Using Artificial Neural Network.",
    "author": "Adewole, A.P., Agwuegbo, S.O.",
    "year": "2010",
    "degree": "Article",
    "dept": "Journal of Computer Science and its Applications",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/5457",
    "irUrl": "https://ir.unilag.edu.ng/items/676bf1af-5ef0-4df1-ab76-d407dcdad586",
    "pdfUrl": "https://ir.unilag.edu.ng/items/676bf1af-5ef0-4df1-ab76-d407dcdad586",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Analog Signal",
      "Data Communication",
      "Digital Signal",
      "Neural Networks",
      "Signal Processing",
      "Research Subject Categories::TECHNOLOGY::Information technology::Computer science::Computer science",
      "Computer"
    ],
    "abstract": "In this paper, Feed Forward Multi-Layer Perceptron neural network was adapted as a digital filtering tool in modelling communications systems that were corrupted by noise or interference. Discrete-Fourier Transform was used to reduce error in transmission. The input and target output data from th..."
  },
  {
    "id": "ir-48",
    "title": "Nigerian Preservice Science, Technology, and Mathematics Teachers’ Computer Self-Efficacy: An Exploration based on Gender, Age and Discipline of Study",
    "author": "Awofala, A. O. A., Fatade, Alfred O., Udeani, Uchenna N.",
    "year": "2015",
    "degree": "Article",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/10128",
    "irUrl": "https://ir.unilag.edu.ng/items/9752835a-8a92-4fb6-abe6-d1a9e1b96c19",
    "pdfUrl": "https://ir.unilag.edu.ng/items/9752835a-8a92-4fb6-abe6-d1a9e1b96c19",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Computer self-efficacy, Preservice teachers, Gender, Age, Discipline of study, Nigerian",
      "Computer"
    ],
    "abstract": "The global acceptance of information and communication technologies in education is not without barriers and\r\none major barrier on the part of teacher educator implementation effort is preservice teachers’ perception of and\r\ncapabilities for applying computer technology. Although the construct of..."
  },
  {
    "id": "ir-49",
    "title": "Architecture",
    "author": "Adebayo, A. K., Iweka, A. C., Ogunbodede, B. F., Igwe, J. M.",
    "year": "2013",
    "degree": "Article",
    "dept": "Facta Universitatis",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/7560",
    "irUrl": "https://ir.unilag.edu.ng/items/5fddb58c-5965-4e07-babc-b1e89dd47fb9",
    "pdfUrl": "https://ir.unilag.edu.ng/items/5fddb58c-5965-4e07-babc-b1e89dd47fb9",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Architectural planning",
      "Culture",
      "Cultural symbolism",
      "Identity",
      "Place",
      "Space",
      "Research Subject Categories::TECHNOLOGY::Civil engineering and architecture::Architecture and architectural conservation and restoration::Architecture",
      "Architecture"
    ],
    "abstract": "Despite the modern and grandiose appearance of most architectural projects, closer examinations cast doubts on their sensitivity to the cultural and traditional past of the societies for which they were intended. Space for human habitation and interaction is one of the primary aspects of man's cu..."
  },
  {
    "id": "ir-50",
    "title": "Creating Sustainable Safety in Urban Residential Neighbourhoods through Architectural Design",
    "author": "Iweka, A. C., Adebayo, A. K., Igwe, J. M.",
    "year": "2009",
    "degree": "Article",
    "dept": "Department of Architecture, Ahmadu Bello University",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/7591",
    "irUrl": "https://ir.unilag.edu.ng/items/d320afea-07b0-4dc2-9e5c-fd7c39a79361",
    "pdfUrl": "https://ir.unilag.edu.ng/items/d320afea-07b0-4dc2-9e5c-fd7c39a79361",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Architectural design",
      "Design",
      "Crime prevention",
      "Neighbourhood safety",
      "Violence",
      "Research Subject Categories::TECHNOLOGY::Civil engineering and architecture::Architecture and architectural conservation and restoration::Architecture",
      "Architecture"
    ],
    "abstract": "Although the police and the criminal justice system are regarded as key contributors to the fight against crimes in urban residential neighbourhoods, recent thinking is that the complexity of the phenomena requires a wider approach. One of the newer approaches being propagated is sustainable urba..."
  },
  {
    "id": "ir-51",
    "title": "Typological Analysis of Housing Development in the Lagos Peri-urban Settlements",
    "author": "Adedire, F. M., Iweka, A. C.",
    "year": "2017",
    "degree": "Article",
    "dept": "Abubakar Tafawa Balewa University, Bauchi",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/7567",
    "irUrl": "https://ir.unilag.edu.ng/items/825c6ea6-65ce-4eae-8dbf-a3728c74b805",
    "pdfUrl": "https://ir.unilag.edu.ng/items/825c6ea6-65ce-4eae-8dbf-a3728c74b805",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Peri-urban",
      "Housing typology",
      "Architecture",
      "Socio-demography",
      "Housing initiatives",
      "Research Subject Categories::TECHNOLOGY::Civil engineering and architecture::Architecture and architectural conservation and restoration::Architecture"
    ],
    "abstract": "The research examined the typological analysis of housing development in the peri-urban settlements of Lagos State, Nigeria. Case study methodology was adopted using random sampling to select housing developments, under different housing initiatives, in purposively selected peri-urban settlements..."
  },
  {
    "id": "ir-52",
    "title": "Nigerian National Building Code as it Relates to Material Specification and Quality Control",
    "author": "Iweka, A. C., Falade, F. A., Adebayo, A. K.",
    "year": "2010",
    "degree": "Article",
    "dept": "Federal University of Technology, Akure",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/7573",
    "irUrl": "https://ir.unilag.edu.ng/items/c9393975-b447-4b7a-b85b-d5e282e45aa3",
    "pdfUrl": "https://ir.unilag.edu.ng/items/c9393975-b447-4b7a-b85b-d5e282e45aa3",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Building code",
      "Material specification",
      "Quality control",
      "Research Subject Categories::TECHNOLOGY::Civil engineering and architecture::Architecture and architectural conservation and restoration::Architecture",
      "Architecture"
    ],
    "abstract": "Buildings are generally assessed using the criteria of firmness, utility and beauty, to determine the degree to which they are fit for purpose. The Nigerian National Building Code provides broad guides on general specifications and quality control, to ensure that materials used to execute buildin..."
  },
  {
    "id": "ir-53",
    "title": "Research on Why Architecture Students Ends up  not Practicing Architecture",
    "author": "Ajisafe O. R., Badmus W. O., Adekolujo W. A., Ajakaiye O. R., Afolabi B. P., Fadeyi A. A., Opoko a. P.",
    "year": "2023",
    "degree": "Article",
    "dept": "International Journal of Innovative Science and Research Technology (IJISRT)",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/14474",
    "irUrl": "https://ir.unilag.edu.ng/items/6c088977-2612-4051-9db7-0b8255531cc3",
    "pdfUrl": "https://ir.unilag.edu.ng/items/6c088977-2612-4051-9db7-0b8255531cc3",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "TECHNOLOGY::Civil engineering and architecture::Architecture and architectural conservation and restoration::Architecture",
      "Practice",
      "Student",
      "Architecture"
    ],
    "abstract": "The steady decline in the amount of students who study architecture and do not end up in the practise of the study of architecture has become worrisome. The purpose of this study is to investigate the possible factors that contribute to the rise in this disparities. The research explores the reas..."
  },
  {
    "id": "ir-54",
    "title": "Housing Delivery in Nigeria: The Paradox of Complementary Social Needs",
    "author": "Iweka, A. C., Igwe, J. M.",
    "year": "2009",
    "degree": "Article",
    "dept": "International Institute for research and advanced studies, University of Port Harcourt",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/7593",
    "irUrl": "https://ir.unilag.edu.ng/items/ad5a0ad4-046a-4dc5-84e4-d01f97b1a307",
    "pdfUrl": "https://ir.unilag.edu.ng/items/ad5a0ad4-046a-4dc5-84e4-d01f97b1a307",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Housing delivery",
      "Housing adequacy",
      "Housing instability",
      "Urbanization",
      "Slum",
      "Research Subject Categories::TECHNOLOGY::Civil engineering and architecture::Architecture and architectural conservation and restoration::Architecture",
      "Architecture"
    ],
    "abstract": "An increasing body of evidence concerning urban dwellers that live in less-than-desirable conditions in Nigeria suggests the absence of effective housing solutions and the need for adequate and affordable shelter. This paper addresses the inevitable problems of housing delivery in Nigeria especia..."
  },
  {
    "id": "ir-55",
    "title": "Awareness, attitude and ethical concerns among faculty members in Nigerian universities on open educational resources (OERs)",
    "author": "Fadehan, O.A, Okiki, O.C",
    "year": "2023",
    "degree": "Article",
    "dept": "University of Lagos",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/12486",
    "irUrl": "https://ir.unilag.edu.ng/items/89215002-63c3-46c2-bc47-3bbe74d3a31e",
    "pdfUrl": "https://ir.unilag.edu.ng/items/89215002-63c3-46c2-bc47-3bbe74d3a31e",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Okiki"
    ],
    "abstract": "Based on a descriptive research design, this study examined the variables of the levels of awareness, attitude and ethical concern in relation to faculty members in Nigerian universities and Open Educational Resources (OER). Against the backdrop of the five hypotheses raised and tested, findings ..."
  },
  {
    "id": "ir-56",
    "title": "An exploratory study on institutional repository, social networking, and bibliographic databases of scholarly communication in Nigeria's academic landscape",
    "author": "Okiki, O.C, Odunlade, R.O",
    "year": "2019",
    "degree": "Article",
    "dept": "Taylor & Francis",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "662022ba-1c9d-40e6-9333-01b542e5da0e",
    "irUrl": "https://ir.unilag.edu.ng/items/662022ba-1c9d-40e6-9333-01b542e5da0e",
    "pdfUrl": "https://ir.unilag.edu.ng/items/662022ba-1c9d-40e6-9333-01b542e5da0e",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Okiki"
    ],
    "abstract": "This study seeks to explore institutional repository, social networking, and bibliographic databases of scholarly communication in Nigeria. Six institutional repositories (IR) were selected and five leading authors had their works manually crosschecked in two citation indexes and self-archived in..."
  },
  {
    "id": "ir-57",
    "title": "The bearing effect of Health Information in achieving Millennium Development Goals in selected Public Libraries in South-West",
    "author": "Okiki, O.C, Omotosho, A.M",
    "year": "2013",
    "degree": "Article",
    "dept": "A Publication of Ebonyi State State University Library & Heirloom Education ser",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/4394",
    "irUrl": "https://ir.unilag.edu.ng/items/022121ac-576d-442e-a996-d256c3cb3ee2",
    "pdfUrl": "https://ir.unilag.edu.ng/items/022121ac-576d-442e-a996-d256c3cb3ee2",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Millennium Development Goals",
      "Public libraries",
      "Public health",
      "Okiki"
    ],
    "abstract": "The paper surveys the bearing effect of Public libraries played in the attainment of heath Millennium Development Goals, using the South-West region of Nigeria. The bid to reduce infant and maternal mortality, HIV/AIDS, Malaria level worldwide led to the declaration of Millennium Development Goal..."
  },
  {
    "id": "ir-58",
    "title": "Building Collaboration for an Institutional Repository in Africa: Transcending Barriers, Creating Opportunities",
    "author": "Zaid, Y.A, Okiki, O.C",
    "year": "2014",
    "degree": "Article",
    "dept": "Taylor and Francis Group",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/928",
    "irUrl": "https://ir.unilag.edu.ng/items/20d851e1-e0fa-42ac-b67e-e61cdd4351a0",
    "pdfUrl": "https://ir.unilag.edu.ng/items/20d851e1-e0fa-42ac-b67e-e61cdd4351a0",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Digitization",
      "Institutional Repository",
      "Information Sharing",
      "Library Holdings",
      "Okiki"
    ],
    "abstract": "The contributions of African scholars living in Africa to world knowledge heritage are limited when compared with their counterparts elsewhere. Many scholars have adduced diverse reasons for this state of affairs, including the scattered and uncoordinated nature of their contributions, the low im..."
  },
  {
    "id": "ir-59",
    "title": "Perceived benefits of implementing artificial in Nigerian libraries",
    "author": "Nduka, S.C., Tella, A. A., Okiki, O.C",
    "year": "2023",
    "degree": "Article",
    "dept": "Department of Library and Information Science, Bayero University",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "123456789/12940",
    "irUrl": "https://ir.unilag.edu.ng/items/24fa6cf9-0875-4bed-94de-ec8209450a77",
    "pdfUrl": "https://ir.unilag.edu.ng/items/24fa6cf9-0875-4bed-94de-ec8209450a77",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Okiki"
    ],
    "abstract": "This study examined the perceived benefits of implementing artificial intelligence in Nigerian libraries. This study adopted a qualitative method, with structured interviews used for data gathering. 31 librarians were purposively selected from federal university libraries in Nigeria. The findings..."
  },
  {
    "id": "ir-60",
    "title": "Assessment of the Contribution of Online Information Resources in Open Distance Learning Mode to the Development of Lifelong Learning in South-West, Nigeria",
    "author": "Oladipo, A.J, Okiki, O.C",
    "year": "2020",
    "degree": "Article",
    "dept": "Routledge Taylor & Francis",
    "faculty": "University of Lagos",
    "supervisor": "Institutional Repository Record",
    "handle": "101a466f-6002-47cf-a793-5d205f691139",
    "irUrl": "https://ir.unilag.edu.ng/items/101a466f-6002-47cf-a793-5d205f691139",
    "pdfUrl": "https://ir.unilag.edu.ng/items/101a466f-6002-47cf-a793-5d205f691139",
    "citations": "Verified IR",
    "type": "Journal Article",
    "subjects": [
      "Online information resources",
      "Open and distance learning",
      "Lifelong learning",
      "Okiki"
    ],
    "abstract": "Global information resources and sophisticated technology have accelerated the availability and utilization of Online Information Resources (OIR) in the Open Distance Learning environment. The study examines the contributions of OIR to Open Distance and Lifelong Learning in relation to three purp..."
  }
];

  /* ==========================================================================
     3. SUBSCRIBED DATABASES (ALL 15 E-RESOURCES)
     ========================================================================== */
  const DATABASES_INDEX = [
    {
      name: "ScienceDirect",
      provider: "Elsevier",
      category: "stem",
      categoryName: "Science & Engineering",
      access: "Campus IP Access",
      url: "https://www.sciencedirect.com/",
      logo: "assets/db/sciencedirect.png",
      coverage: "15M+ scientific articles, 2,500+ journals, 900,000+ Open Access titles",
      desc: "World leading database for peer-reviewed research in physical sciences, engineering, life sciences, environmental biology, and clinical medicine."
    },
    {
      name: "JSTOR",
      provider: "ITHAKA",
      category: "humanities",
      categoryName: "Humanities & Social Sciences",
      access: "Campus IP Access",
      url: "https://www.jstor.org/",
      logo: "assets/db/jstor.png",
      coverage: "2,000+ journals, 20,000+ scholarly books, 2M+ primary sources",
      desc: "Essential digital archive of scholarly journals and books in history, African studies, philosophy, political science, literature, and social sciences."
    },
    {
      name: "HeinOnline",
      provider: "William S. Hein & Co.",
      category: "law",
      categoryName: "Law & Legal Studies",
      access: "Faculty of Law & Campus IP",
      url: "https://heinonline.org/HOL/Welcome",
      logo: "assets/db/heinonline.png",
      coverage: "3,300+ legal periodicals, World Trials Library, Nigerian Law Reports",
      desc: "The premier online legal research platform covering constitutional law, international treaties, historical jurisprudence, law reviews, and statutory codes."
    },
    {
      name: "ProQuest Central",
      provider: "Clarivate / ProQuest",
      category: "multi",
      categoryName: "Multidisciplinary",
      access: "Campus IP Access",
      url: "https://www.proquest.com/?accountid=173489",
      logo: "assets/db/proquest.jpg",
      coverage: "160+ subject disciplines, 100,000+ full-text dissertations, NBER papers",
      desc: "Massive multidisciplinary search platform spanning business, health, humanities, education, science, technology, and global newspapers."
    },
    {
      name: "Emerald Insight",
      provider: "Emerald Publishing",
      category: "business",
      categoryName: "Business & Management",
      access: "Remote Registration / Campus IP",
      url: "https://www.emerald.com/insight/",
      logo: "assets/db/emerald.png",
      coverage: "300+ management journals, 2,000+ book volumes in public policy",
      desc: "Leading international publisher of journals and books in management, finance, marketing, library studies, education, and social policy."
    },
    {
      name: "Research4Life (Hinari, AGORA, OARE, ARDI, GOALI)",
      provider: "UN Agencies (WHO, FAO, UNEP, WIPO, ILO)",
      category: "multi",
      categoryName: "Multidisciplinary",
      access: "Automation Unit Credentials",
      url: "https://www.research4life.org/",
      logo: "assets/db/research4life.png",
      coverage: "140,000+ journals and books in health, agriculture, law, environment",
      desc: "Global partnership providing UNILAG researchers full-text access to top medical (HINARI), agricultural (AGORA), and environmental (OARE) science."
    },
    {
      name: "Cambridge University Press (Cambridge Core)",
      provider: "Cambridge University Press",
      category: "multi",
      categoryName: "Multidisciplinary",
      access: "Campus IP Access",
      url: "https://www.cambridge.org/core",
      logo: "assets/db/cambridge.jpg",
      coverage: "380+ peer-reviewed journals, 33,000+ Cambridge monographs",
      desc: "Prestigious academic platform covering mathematics, physics, international law, African politics, engineering, and linguistics."
    },
    {
      name: "Springer Nature (SpringerLink)",
      provider: "Springer Nature",
      category: "stem",
      categoryName: "Science & Engineering",
      access: "Campus IP Access",
      url: "https://link.springer.com/",
      logo: "assets/db/springer.png",
      coverage: "3,000+ peer-reviewed journals, 10M+ scientific documents",
      desc: "Global scientific research across biotechnology, applied physics, computer science, medicine, materials engineering, and mathematics."
    },
    {
      name: "JaypeeDigital Medical",
      provider: "Jaypee Brothers Medical Publishers",
      category: "medical",
      categoryName: "Health & Medicine",
      access: "College of Medicine & IP",
      url: "https://www.jaypeedigital.com/",
      logo: "assets/db/jaypee.png",
      coverage: "3,500+ health science books, clinical videos, surgical journals",
      desc: "Specialized clinical reference suite for medicine, dentistry, nursing, pharmacology, and allied health sciences."
    },
    {
      name: "ASME Digital Collection",
      provider: "American Society of Mechanical Engineers",
      category: "stem",
      categoryName: "Science & Engineering",
      access: "Campus IP Access",
      url: "https://asmedigitalcollection.asme.org/",
      logo: "assets/db/asme.jpg",
      coverage: "ASME Transactions from 1933, Conference Proceedings, Standards",
      desc: "Premier engineering repository for mechanical engineering, thermodynamics, robotics, nanotechnology, and manufacturing standards."
    },
    {
      name: "Brill Online",
      provider: "Brill Academic",
      category: "humanities",
      categoryName: "Humanities & Social Sciences",
      access: "Campus IP Access",
      url: "https://brill.com/",
      logo: "assets/db/brill.png",
      coverage: "360+ journals, 8,000+ volumes in Middle East & African studies",
      desc: "World renowned publications in Asian & African studies, international law, religious studies, human rights, and classical antiquity."
    },
    {
      name: "ProQuest Ebook Central",
      provider: "ProQuest",
      category: "multi",
      categoryName: "Multidisciplinary",
      access: "Campus IP & Single Sign-On",
      url: "https://ebookcentral.proquest.com/",
      logo: "assets/db/ebookcentral.png",
      coverage: "150,000+ academic ebooks from major university presses",
      desc: "Comprehensive ebook lending platform across business, medicine, education, arts, social sciences, and engineering."
    },
    {
      name: "iG Publishing E-Books",
      provider: "iG Library",
      category: "multi",
      categoryName: "Multidisciplinary",
      access: "Campus IP Access",
      url: "https://portal.igpublish.com/",
      logo: "assets/db/igpublishing.png",
      coverage: "Over 150,000 academic ebook titles",
      desc: "Multi-publisher digital library platform offering specialized textbooks across medical, social, and engineering faculties."
    },
    {
      name: "IJMSO (Intl. Journal of Math Sciences & Optimization)",
      provider: "University of Lagos",
      category: "stem",
      categoryName: "Science & Engineering",
      access: "Open Access / UNILAG Hosted",
      url: "http://ijmso.unilag.edu.ng/",
      logo: "assets/db/ijmso.png",
      coverage: "Peer-reviewed mathematical papers, optimization models",
      desc: "UNILAG-hosted international journal dedicated to original research in pure mathematics, applied statistics, and numerical optimization."
    },
    {
      name: "HSTalks: Biomedical & Life Sciences",
      provider: "Henry Stewart Talks",
      category: "medical",
      categoryName: "Health & Medicine",
      access: "Campus IP Access",
      url: "https://hstalks.com/biosci/",
      logo: "assets/db/hstalks.png",
      coverage: "Over 3,000 audio-visual lectures by world leading scientists",
      desc: "Curated seminar-style multimedia lectures by Nobel laureates and leading clinicians in genetics, immunology, biochemistry, and cell biology."
    }
  ];

  /* ==========================================================================
     4. CITATION BUILDER UTILITIES
     ========================================================================== */
  function generateCitations(item) {
    const title = item.title;
    const author = item.author;
    const year = item.year;
    const url = item.irUrl || `https://ir.unilag.edu.ng/handle/${item.handle || "123456789/10001"}`;
    const dept = item.dept || "University of Lagos";
    const type = item.type || "Thesis";

    return {
      apa: `${author} (${year}). ${title} [${type}, University of Lagos]. UNILAG Institutional Repository. ${url}`,
      mla: `${author}. "${title}." ${type}, University of Lagos, ${year}. UNILAG Institutional Repository, ${url.replace('https://', '')}.`,
      harvard: `${author}, ${year}. ${title}. ${type}. Lagos: University of Lagos. Available at: <${url}> [Accessed ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}].`,
      chicago: `${author}. "${title}." ${type}, University of Lagos, ${year}. ${url}.`
    };
  }

  /* ==========================================================================
     5. STATE MANAGEMENT FOR PAGINATION
     ========================================================================== */
  const state = {
    cat: {
      query: "",
      field: "Anywhere",
      page: 1,
      totalResults: [],
      isLoading: false
    },
    repo: {
      query: "",
      filter: "all",
      page: 1,
      totalResults: [],
      isLoading: false
    },
    db: {
      query: "",
      subject: "all"
    }
  };

  /* ==========================================================================
     6. DOM INJECTION FOR CITATION MODAL
     ========================================================================== */
  function ensureCitationModal() {
    if (document.getElementById("citeModal")) return;
    const modal = document.createElement("div");
    modal.id = "citeModal";
    modal.className = "cite-modal-backdrop";
    modal.innerHTML = `
      <div class="cite-modal" role="dialog" aria-modal="true" aria-labelledby="citeTitle">
        <div class="cite-modal-head">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="s-badge s-badge-maroon" style="font-size:.65rem">CITATION TOOL</span>
            <h3 id="citeTitle" style="font-family:var(--serif);font-size:1.35rem;margin:0">Cite This Paper</h3>
          </div>
          <button class="cite-modal-close" id="citeCloseBtn" aria-label="Close citation modal">&times;</button>
        </div>
        <div class="cite-modal-body">
          <p id="citeItemName" style="font-weight:600;font-size:.9rem;color:var(--ink);margin-bottom:14px;line-height:1.4"></p>
          <div class="cite-tabs" role="tablist">
            <button class="cite-tab-btn active" data-style="apa">APA 7th</button>
            <button class="cite-tab-btn" data-style="mla">MLA 9th</button>
            <button class="cite-tab-btn" data-style="harvard">Harvard</button>
            <button class="cite-tab-btn" data-style="chicago">Chicago</button>
          </div>
          <div class="cite-box">
            <div id="citeText" class="cite-text" tabindex="0"></div>
            <button id="citeCopyBtn" class="btn btn--sm" style="margin-top:12px;background:var(--oxblood);color:var(--cream)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Citation
            </button>
          </div>
          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--line);font-size:.76rem;color:var(--ink-50);display:flex;justify-content:space-between;align-items:center">
            <span>Direct Repository Record:</span>
            <a id="citeDirectLink" href="#" target="_blank" rel="noopener" style="color:var(--oxblood);font-weight:600;font-family:var(--mono);text-decoration:underline"></a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    let currentCitations = null;

    window.openCitationTool = function (itemJsonStr) {
      try {
        const item = JSON.parse(decodeURIComponent(itemJsonStr));
        currentCitations = generateCitations(item);
        const nameEl = modal.querySelector("#citeItemName");
        const linkEl = modal.querySelector("#citeDirectLink");
        if (nameEl) nameEl.textContent = item.title;
        if (linkEl) {
          linkEl.href = item.irUrl;
          linkEl.textContent = item.irUrl.replace("https://", "");
        }

        // Default to APA
        setActiveCitation("apa");
        modal.classList.add("open");
        document.body.classList.add("is-locked");
      } catch (err) {
        console.error("Citation error:", err);
      }
    };

    function setActiveCitation(style) {
      modal.querySelectorAll(".cite-tab-btn").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-style") === style);
      });
      const citeTextEl = modal.querySelector("#citeText");
      if (citeTextEl && currentCitations && currentCitations[style]) {
        citeTextEl.textContent = currentCitations[style];
      }
      const copyBtn = modal.querySelector("#citeCopyBtn");
      if (copyBtn) {
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Citation
        `;
      }
    }

    modal.querySelectorAll(".cite-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => setActiveCitation(btn.getAttribute("data-style")));
    });

    const closeBtn = modal.querySelector("#citeCloseBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        document.body.classList.remove("is-locked");
      });
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        document.body.classList.remove("is-locked");
      }
    });

    const copyBtn = modal.querySelector("#citeCopyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const citeTextEl = modal.querySelector("#citeText");
        const text = citeTextEl ? citeTextEl.textContent : "";
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:6px;stroke:#4CAF50">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied to Clipboard!
          `;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Citation
            `;
          }, 2200);
        });
      });
    }
  }

  /* ==========================================================================
     7. PAGINATION RENDERER COMPONENT
     ========================================================================== */
  function renderPagination(totalCount, currentPage, pageSize, onPageChange) {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (totalPages <= 1) return "";

    let html = `<div class="s-pagination">`;
    html += `<span class="s-page-info">Page ${currentPage} of ${totalPages} (${totalCount} total)</span>`;
    html += `<div class="s-page-controls">`;

    // Prev Button
    if (currentPage > 1) {
      html += `<button class="s-page-btn" data-go="${currentPage - 1}">&larr; Prev</button>`;
    } else {
      html += `<button class="s-page-btn disabled" disabled>&larr; Prev</button>`;
    }

    // Page numbers
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
        html += `<button class="s-page-btn ${p === currentPage ? 'active' : ''}" data-go="${p}">${p}</button>`;
      } else if (p === currentPage - 3 || p === currentPage + 3) {
        html += `<span class="s-page-dots">&hellip;</span>`;
      }
    }

    // Next Button
    if (currentPage < totalPages) {
      html += `<button class="s-page-btn" data-go="${currentPage + 1}">Next &rarr;</button>`;
    } else {
      html += `<button class="s-page-btn disabled" disabled>Next &rarr;</button>`;
    }

    html += `</div></div>`;
    return html;
  }

  /* ==========================================================================
     8. CATALOGUE SEARCH & IN-PAGE RENDERER
     ========================================================================== */
  function searchCatalogue(query, field) {
    const qClean = (query || "").trim().toLowerCase();
    if (!qClean) return [];

    return UNILAG_CATALOGUE.filter((b) => {
      if (field === "Title") return b.title.toLowerCase().includes(qClean);
      if (field === "Author") return b.author.toLowerCase().includes(qClean);
      if (field === "Subject") return b.subjects.some((s) => s.toLowerCase().includes(qClean));
      if (field === "Class") return b.callNo.toLowerCase().includes(qClean);

      const words = qClean.split(/\s+/).filter(Boolean);
      // Default: Anywhere
      const blob = [
        b.title,
        b.author,
        b.callNo,
        b.desc,
        b.location,
        b.accNo,
        b.publisher,
        ...b.subjects
      ].join(" ").toLowerCase();
      return blob.includes(qClean) || (words.length > 1 && words.every((w) => blob.includes(w)));
    });
  }

  function renderCataloguePage() {
    const host = document.getElementById("catRes");
    const statusEl = document.getElementById("catStatus");
    if (!host) return;

    const { query, field, page, totalResults, isLoading } = state.cat;

    if (isLoading) {
      host.innerHTML = `
        <div class="s-loading">
          <div class="s-spinner"></div>
          <span>Searching complete UNILAG library catalogue holdings and cross-referencing collections...</span>
        </div>
      `;
      return;
    }

    if (!query) {
      host.innerHTML = '<div class="empty">Type a book title, author, call number or subject above to search catalogue holdings.</div>';
      if (statusEl) statusEl.textContent = "";
      return;
    }

    const count = totalResults.length;
    if (count === 0) {
      if (statusEl) statusEl.textContent = `No catalogue holdings found matching "${query}".`;
      host.innerHTML = `
        <div class="s-card" style="text-align:center;padding:36px 20px">
          <h4 style="margin-bottom:8px">No catalogue record found for "${escapeHtml(query)}"</h4>
          <p style="margin-bottom:18px;max-width:54ch;margin-left:auto;margin-right:auto">Try broader search terms like <b>Law</b>, <b>Physics</b>, <b>Biochemistry</b>, <b>Engineering</b>, or query the live NewGenLib OPAC server directly.</p>
          <div>
            <a class="btn btn--sm" href="http://librarydb.unilag.edu.ng/newgenlibctxt/Search?searchText=${encodeURIComponent(query)}&Index=Anywhere" target="_blank" rel="noopener">Query OPAC Terminal <i class="ar"></i></a>
          </div>
        </div>
      `;
      return;
    }

    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = Math.min(startIdx + PAGE_SIZE, count);
    const pageItems = totalResults.slice(startIdx, endIdx);

    if (statusEl) {
      statusEl.textContent = state.cat.isLive ? `Showing ${startIdx + 1}–${endIdx} of ${state.cat.serverTotal || count} catalogue records from UNILAG Library OPAC (librarydb.unilag.edu.ng) for "${query}"` : `Showing ${startIdx + 1}–${endIdx} of ${count} catalogue records for "${query}"`;
    }

    const liveOpacUrl = "http://librarydb.unilag.edu.ng/newgenlibctxt/Search?searchText=" + encodeURIComponent(query) + "&Index=" + encodeURIComponent(field || "Anywhere");
    let itemsHtml = `
      <div style="background:#fff;border:1px solid rgba(108,0,0,.2);border-left:4px solid var(--oxblood);padding:14px 18px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span class="s-badge s-badge-maroon" style="font-size:.56rem">LIVE NEWGENLIB OPAC</span>
            <span class="mono" style="font-size:.62rem;color:var(--ink-50)">librarydb.unilag.edu.ng</span>
          </div>
          <h4 style="margin:0 0 4px;font-size:1.02rem">Search live UNILAG Library OPAC for &ldquo;${escapeHtml(query)}&rdquo;</h4>
          <p style="margin:0;font-size:.8rem;color:var(--ink-70)">Live access to the University of Lagos Online Public Access Catalog across 200,000+ print volumes, textbooks, and theses.</p>
        </div>
        <a class="btn btn--sm" href="${escapeHtml(liveOpacUrl)}" target="_blank" rel="noopener" style="background:var(--oxblood);color:var(--cream);padding:8px 14px;font-size:.6rem;white-space:nowrap">
          Open Live OPAC &rarr;
        </a>
      </div>
    `;

    itemsHtml += pageItems.map((b, idx) => `
      <div class="s-card">
        <div class="s-card-top">
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span class="mono" style="font-size:.56rem;color:var(--oxblood);font-weight:700">#${startIdx + idx + 1}</span>
              <span class="s-badge s-badge-maroon" style="font-size:.5rem">${escapeHtml(b.type || "Book Monograph")}</span>
              <span class="s-badge s-badge-green" style="font-size:.5rem">${escapeHtml(b.status)}</span>
            </div>
            <h4>${escapeHtml(b.title)}</h4>
            <div class="s-card-meta" style="margin-top:7px">
              <span><strong>Author:</strong> ${escapeHtml(b.author)}</span>
              <span>&bull;</span>
              <span><strong>Year:</strong> ${escapeHtml(b.year)}</span>
              <span>&bull;</span>
              <span><strong>Publisher:</strong> ${escapeHtml(b.publisher || "UNILAG Press")}</span>
            </div>
          </div>
        </div>
        <p style="margin:10px 0;line-height:1.55">${escapeHtml(b.desc)}</p>
        
        <!-- Detailed Shelf & Availability Drawer -->
        <div class="s-holding-box">
          <div class="s-holding-item">
            <span class="sh-label">CALL NUMBER</span>
            <span class="sh-val mono" style="color:var(--oxblood);font-weight:700">${escapeHtml(b.callNo)}</span>
          </div>
          <div class="s-holding-item">
            <span class="sh-label">SHELF LOCATION</span>
            <span class="sh-val">${escapeHtml(b.location)}</span>
          </div>
          <div class="s-holding-item">
            <span class="sh-label">COPIES &amp; LOAN</span>
            <span class="sh-val">${escapeHtml(b.copies)} &bull; ${escapeHtml(b.loanPeriod || "14 Days")}</span>
          </div>
          <div class="s-holding-item">
            <span class="sh-label">ACCESSION NO.</span>
            <span class="sh-val mono">${escapeHtml(b.accNo)}</span>
          </div>
        </div>

        <div class="s-card-foot" style="margin-top:12px">
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
            ${(b.subjects || []).slice(0, 3).map((s) => `<span class="s-sub-tag">${escapeHtml(s)}</span>`).join("")}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <button class="btn btn--sm" onclick='window.openBookReserveModal(${JSON.stringify(b).replace(/'/g, "&apos;")})' style="background:var(--oxblood,#6C0000);color:#fff;border:none;padding:7px 14px;font-size:.78rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px">
              Borrow / Reserve for Pickup &rarr;
            </button>
            <a class="btn btn--sm btn--ghost" href="${escapeHtml(b.opacUrl || "http://librarydb.unilag.edu.ng/newgenlibctxt/Search?searchText=" + encodeURIComponent(b.title) + "&Index=Title")}" target="_blank" rel="noopener" style="padding:7px 12px;font-size:.78rem;display:inline-flex;align-items:center;gap:4px">
              View OPAC <svg class="ico ico-sm" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>
            </a>
          </div>
        </div>
      </div>
    `).join("");

    // Append Pagination
    itemsHtml += renderPagination(count, page, PAGE_SIZE, (p) => {
      state.cat.page = p;
      renderCataloguePage();
      host.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    host.innerHTML = itemsHtml;

    // Attach pagination listeners
    host.querySelectorAll(".s-page-btn[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.cat.page = parseInt(btn.getAttribute("data-go"), 10);
        renderCataloguePage();
        host.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ==========================================================================
     9. REPOSITORY SEARCH & IN-PAGE RENDERER (DIRECT IR LINKS & CITATIONS)
     ========================================================================== */
  function searchRepository(query, filterType) {
    const qClean = (query || "").trim().toLowerCase();
    if (!qClean) return [];

    return UNILAG_REPOSITORY.filter((r) => {
      if (filterType === "thesis" && !r.type.includes("Thesis") && !r.type.includes("Dissertation")) return false;
      if (filterType === "inaugural" && !r.type.includes("Inaugural")) return false;
      if (filterType === "article" && !r.type.includes("Journal") && !r.type.includes("Article")) return false;

      const words = qClean.split(/\s+/).filter(Boolean);
      const blob = [
        r.title,
        r.author,
        r.dept,
        r.faculty,
        r.abstract,
        r.degree,
        r.handle,
        ...(r.subjects || [])
      ].join(" ").toLowerCase();

      return blob.includes(qClean) || (words.length > 1 && words.every((w) => blob.includes(w)));
    });
  }

  function renderRepositoryPage() {
    const host = document.getElementById("repoRes");
    const statusEl = document.getElementById("repoStatus");
    if (!host) return;

    const { query, filter, page, totalResults, isLoading } = state.repo;

    if (isLoading) {
      host.innerHTML = `
        <div class="s-loading">
          <div class="s-spinner"></div>
          <span>Querying University of Lagos DSpace Repository (ir.unilag.edu.ng) and scholarly outputs...</span>
        </div>
      `;
      return;
    }

    if (!query) {
      host.innerHTML = '<div class="empty">Type a topic, thesis title, supervisor or author name above to search UNILAG repository.</div>';
      if (statusEl) statusEl.textContent = "";
      return;
    }

    const count = totalResults.length;
    if (count === 0) {
      if (statusEl) statusEl.textContent = `No institutional repository records found matching "${query}".`;
      host.innerHTML = `
        <div class="s-card" style="text-align:center;padding:36px 20px">
          <h4 style="margin-bottom:8px">No repository paper found for "${escapeHtml(query)}"</h4>
          <p style="margin-bottom:18px;max-width:54ch;margin-left:auto;margin-right:auto">Try broader topics like <b>Lagoon</b>, <b>Microgrid</b>, <b>Okiki</b>, <b>Malaria</b>, or search directly inside the live DSpace server.</p>
          <div>
            <a class="btn btn--sm" href="https://ir.unilag.edu.ng/search?query=${encodeURIComponent(query)}" target="_blank" rel="noopener">Query ir.unilag.edu.ng Live <i class="ar"></i></a>
          </div>
        </div>
      `;
      return;
    }

    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = Math.min(startIdx + PAGE_SIZE, count);
    const pageItems = totalResults.slice(startIdx, endIdx);

    if (statusEl) {
      statusEl.textContent = state.repo.isLive ? `Showing ${startIdx + 1}–${endIdx} of ${state.repo.serverTotal || count} live research papers in UNILAG Institutional Repository (DSpace 7) for "${query}"` : `Showing ${startIdx + 1}–${endIdx} of ${count} research papers in UNILAG Institutional Repository for "${query}"`;
    }

    // Live DSpace Repository Query Banner
    const liveSearchUrl = `https://ir.unilag.edu.ng/search?query=${encodeURIComponent(query)}`;
    let itemsHtml = `
      <div style="background:#fff;border:1px solid rgba(108,0,0,.2);border-left:4px solid var(--oxblood);padding:14px 18px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span class="s-badge s-badge-maroon" style="font-size:.56rem">LIVE DSPACE ARCHIVE</span>
            <span class="mono" style="font-size:.62rem;color:var(--ink-50)">ir.unilag.edu.ng</span>
          </div>
          <h4 style="margin:0 0 4px;font-size:1.02rem">Search live UNILAG Repository for &ldquo;${escapeHtml(query)}&rdquo;</h4>
          <p style="margin:0;font-size:.8rem;color:var(--ink-70)">Access the complete university digital archive of 15,000+ theses, dissertations, and faculty publications.</p>
        </div>
        <a class="btn btn--sm" href="${escapeHtml(liveSearchUrl)}" target="_blank" rel="noopener" style="background:var(--oxblood);color:var(--cream);padding:8px 14px;font-size:.6rem;white-space:nowrap">
          Open Live IR Results &rarr;
        </a>
      </div>
    `;

    itemsHtml += pageItems.map((r, idx) => {
      // Direct authentic paper link in UNILAG DSpace
      const exactIrUrl = r.irUrl || (r.handleVerified ? `https://ir.unilag.edu.ng/handle/${r.handle}` : `https://ir.unilag.edu.ng/search?query=${encodeURIComponent(r.title)}`);
      const itemJson = encodeURIComponent(JSON.stringify(r));

      return `
        <div class="s-card">
          <div class="s-card-top">
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <span class="mono" style="font-size:.56rem;color:var(--oxblood);font-weight:700">#${startIdx + idx + 1}</span>
                <span class="s-badge s-badge-blue" style="font-size:.5rem">${escapeHtml(r.type || r.degree || "Thesis")}</span>
                <span class="s-badge s-badge-gold" style="font-size:.5rem">UNILAG IR RECORD</span>
              </div>
              <h4><a href="${escapeHtml(exactIrUrl)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${escapeHtml(r.title)}</a></h4>
              <div class="s-card-meta" style="margin-top:7px">
                <span><strong>Author:</strong> ${escapeHtml(r.author)}</span>
                <span>&bull;</span>
                <span><strong>Year:</strong> ${escapeHtml(r.year)}</span>
                <span>&bull;</span>
                <span><strong>Department:</strong> ${escapeHtml(r.dept)}</span>
              </div>
            </div>
          </div>
          <p style="margin:10px 0;line-height:1.55">${escapeHtml(r.abstract)}</p>
          
          <div class="s-ir-box">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <span class="mono" style="font-size:.65rem;color:var(--oxblood);font-weight:700">${r.handleVerified ? 'HANDLE URI:' : 'DSPACE RECORD:'}</span>
              <a href="${escapeHtml(exactIrUrl)}" target="_blank" rel="noopener" class="mono" style="font-size:.68rem;color:var(--oxblood);text-decoration:underline">
                ${escapeHtml(exactIrUrl)}
              </a>
            </div>
            <div style="display:flex;gap:14px;align-items:center;font-size:.68rem;color:var(--ink-70);margin-top:6px">
              <span><strong>Supervisor / Committee:</strong> ${escapeHtml(r.supervisor || "Graduate School, UNILAG")}</span>
              <span>&bull;</span>
              <span><strong>Citations:</strong> <b style="color:var(--oxblood)">${escapeHtml(String(r.citations || "0"))}</b></span>
            </div>
          </div>

          <div class="s-card-foot" style="margin-top:12px">
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <button class="btn btn--sm btn-cite" onclick="window.openCitationTool('${itemJson}')" style="background:#f4ece1;color:var(--oxblood);border:1px solid rgba(108,0,0,.25);padding:6px 12px;font-size:.56rem">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:5px">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 15h2a2 2 0 0 0 2-2V9H4v6z"></path>
                  <path d="M16 15h2a2 2 0 0 0 2-2V9h-4v6z"></path>
                </svg>
                Cite This Paper
              </button>
              ${r.pdfUrl ? `
                <a class="btn btn--sm btn--ghost" href="${escapeHtml(r.pdfUrl)}" target="_blank" rel="noopener" style="padding:6px 12px;font-size:.56rem">
                  Download Full-Text PDF &darr;
                </a>
              ` : ''}
            </div>

            <!-- Exact Direct Paper Link to IR -->
            <a class="btn btn--sm" href="${escapeHtml(exactIrUrl)}" target="_blank" rel="noopener" style="padding:6px 14px;font-size:.56rem;background:var(--oxblood);color:var(--cream)">
              Open in UNILAG IR <svg class="ico ico-sm" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>
            </a>
          </div>
        </div>
      `;
    }).join("");

    // Append Pagination
    itemsHtml += renderPagination(count, page, PAGE_SIZE, (p) => {
      state.repo.page = p;
      renderRepositoryPage();
      host.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    host.innerHTML = itemsHtml;

    // Attach pagination listeners
    host.querySelectorAll(".s-page-btn[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.repo.page = parseInt(btn.getAttribute("data-go"), 10);
        renderRepositoryPage();
        host.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ==========================================================================
     10. DATABASES FILTER & IN-PAGE RENDERER
     ========================================================================== */
  function searchDatabases(query, subject) {
    const qClean = (query || "").trim().toLowerCase();
    const sClean = subject || "all";

    return DATABASES_INDEX.filter((d) => {
      if (sClean !== "all" && d.category !== sClean) return false;
      if (!qClean) return true;
      const words = qClean.split(/\s+/).filter(Boolean);
      const blob = [d.name, d.provider, d.categoryName, d.desc, d.coverage].join(" ").toLowerCase();
      return blob.includes(qClean) || (words.length > 1 && words.every((w) => blob.includes(w)));
    });
  }

  function renderDatabasesPage() {
    const host = document.getElementById("dbRes");
    const statusEl = document.getElementById("dbStatus");
    if (!host) return;

    const { query, subject } = state.db;
    const results = searchDatabases(query, subject);

    if (statusEl) {
      statusEl.textContent = `Showing ${results.length} subscribed e-resources${query ? ` matching "${query}"` : ""}`;
    }

    if (!results.length) {
      host.innerHTML = `
        <div class="s-card" style="text-align:center;padding:36px 20px">
          <h4 style="margin-bottom:8px">No matching database found</h4>
          <p>Try searching by discipline like "Law", "Medicine", "Engineering", or click "Show All 15".</p>
        </div>
      `;
      return;
    }

    host.innerHTML = results.map((d) => `
      <div class="s-card">
        <div class="s-card-top">
          <div style="display:flex;gap:14px;align-items:center;flex:1">
            ${d.logo ? `<img src="${escapeHtml(d.logo)}" alt="${escapeHtml(d.name)}" style="height:32px;max-width:110px;object-fit:contain;background:#f9f9f9;padding:4px;border:1px solid var(--line)">` : ''}
            <div>
              <h4>${escapeHtml(d.name)}</h4>
              <div class="s-card-meta" style="margin-top:4px">
                <span><strong>Provider:</strong> ${escapeHtml(d.provider)}</span>
                <span>&bull;</span>
                <span style="color:var(--oxblood);font-weight:600">${escapeHtml(d.categoryName)}</span>
              </div>
            </div>
          </div>
          <span class="s-badge ${d.access.includes('IP') ? 's-badge-gold' : 's-badge-maroon'}">${escapeHtml(d.access)}</span>
        </div>
        <p style="margin:10px 0;line-height:1.55">${escapeHtml(d.desc)}</p>
        <div class="s-card-foot">
          <span style="color:var(--ink-50)">Coverage: ${escapeHtml(d.coverage)}</span>
          <a class="btn btn--sm" href="${escapeHtml(d.url)}" target="_blank" rel="noopener" style="padding:6px 14px;font-size:.56rem;background:var(--oxblood);color:var(--cream)">
            Access Database <svg class="ico ico-sm" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>
          </a>
        </div>
      </div>
    `).join("");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ==========================================================================
     11. MASTER INITIALIZATION & EVENT DISPATCHER
     ========================================================================== */
  function init() {
    ensureCitationModal();

    const catIn = document.getElementById("catIn");
    const catForm = document.getElementById("catForm");
    const catIndex = document.getElementById("catIndex");

    const repoIn = document.getElementById("repoIn");
    const repoForm = document.getElementById("repoForm");
    const repoType = document.getElementById("repoType");

    const dbIn = document.getElementById("dbIn");
    const dbForm = document.getElementById("dbForm");
    const dbSubject = document.getElementById("dbSubject");

    const pageIn = document.getElementById("pageIn");

    // Execute Catalogue Search
    async function executeCatalogue(q) {
      const query = (q !== undefined ? q : (catIn ? catIn.value : "")).trim();
      const field = catIndex ? catIndex.value : "Anywhere";

      state.cat.query = query;
      state.cat.field = field;
      state.cat.page = 1;

      if (!query) {
        state.cat.totalResults = [];
        state.cat.isLive = false;
        renderCataloguePage();
        return;
      }

      state.cat.isLoading = true;
      renderCataloguePage();

      // 1. Query live UNILAG NewGenLib OPAC API
      try {
        const resp = await fetch('/api/cat-search?q=' + encodeURIComponent(query) + '&field=' + encodeURIComponent(field));
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.results && data.results.length > 0) {
            state.cat.totalResults = data.results;
            state.cat.serverTotal = data.total;
            state.cat.isLive = true;
            state.cat.isLoading = false;
            renderCataloguePage();
            return;
          }
        }
      } catch (err) {
        console.warn("Live OPAC proxy unreachable, using local index", err);
      }

      // 2. Fallback to local catalogue index
      const localMatches = searchCatalogue(query, field);
      state.cat.totalResults = localMatches;
      state.cat.serverTotal = localMatches.length;
      state.cat.isLive = false;
      state.cat.isLoading = false;
      renderCataloguePage();
    }

    // Execute Repository Search
    async function executeRepository(q) {
      const query = (q !== undefined ? q : (repoIn ? repoIn.value : "")).trim();
      const filter = repoType ? repoType.value : "all";

      state.repo.query = query;
      state.repo.filter = filter;
      state.repo.page = 1;

      if (!query) {
        state.repo.totalResults = [];
        state.repo.isLive = false;
        renderRepositoryPage();
        return;
      }

      state.repo.isLoading = true;
      renderRepositoryPage();

      // 1. Try Live DSpace 7 Proxy API
      try {
        const resp = await fetch('/api/ir-search?q=' + encodeURIComponent(query) + '&size=20');
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.results && data.results.length > 0) {
            state.repo.totalResults = data.results;
            state.repo.serverTotal = data.total;
            state.repo.isLive = true;
            state.repo.isLoading = false;
            renderRepositoryPage();
            return;
          }
        }
      } catch (err) {
        console.warn("Live DSpace proxy unreachable, using local index", err);
      }

      // 2. Fallback to authentic pre-indexed repository records
      const localMatches = searchRepository(query, filter);
      state.repo.totalResults = localMatches;
      state.repo.serverTotal = localMatches.length;
      state.repo.isLive = false;
      state.repo.isLoading = false;
      renderRepositoryPage();
    }

    // Execute Databases Search
    function executeDatabases(q) {
      const query = (q !== undefined ? q : (dbIn ? dbIn.value : "")).trim();
      const subject = dbSubject ? dbSubject.value : "all";

      state.db.query = query;
      state.db.subject = subject;
      renderDatabasesPage();
    }

    // Form & Button Submissions
    const catBtn = document.getElementById("catBtn");
    if (catBtn) {
      catBtn.addEventListener("click", (e) => {
        e.preventDefault();
        executeCatalogue();
      });
    }
    if (catForm) {
      catForm.addEventListener("submit", (e) => {
        e.preventDefault();
        executeCatalogue();
      });
    }
    if (catIn) {
      catIn.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          executeCatalogue();
        }
      });
    }
    if (catIndex) {
      catIndex.addEventListener("change", () => executeCatalogue());
    }

    const repoBtn = document.getElementById("repoBtn");
    if (repoBtn) {
      repoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        executeRepository();
      });
    }
    if (repoForm) {
      repoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        executeRepository();
      });
    }
    if (repoIn) {
      repoIn.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          executeRepository();
        }
      });
    }
    if (repoType) {
      repoType.addEventListener("change", () => executeRepository());
    }

    const dbBtn = document.getElementById("dbBtn");
    if (dbBtn) {
      dbBtn.addEventListener("click", (e) => {
        e.preventDefault();
        executeDatabases();
      });
    }
    if (dbForm) {
      dbForm.addEventListener("submit", (e) => {
        e.preventDefault();
        executeDatabases();
      });
    }
    if (dbIn) {
      dbIn.addEventListener("input", () => executeDatabases());
    }
    if (dbSubject) {
      dbSubject.addEventListener("change", () => executeDatabases());
    }

    // Suggestion Chips
    document.querySelectorAll("[data-catsugg]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const val = chip.getAttribute("data-catsugg");
        if (catIn) catIn.value = val;
        executeCatalogue(val);
      });
    });

    document.querySelectorAll("[data-reposugg]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const val = chip.getAttribute("data-reposugg");
        if (repoIn) repoIn.value = val;
        executeRepository(val);
      });
    });

    document.querySelectorAll("[data-dbsugg]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const val = chip.getAttribute("data-dbsugg");
        if (dbSubject) dbSubject.value = "all";
        const queryVal = val === "all" ? "" : val;
        if (dbIn) dbIn.value = queryVal;
        executeDatabases(queryVal);
      });
    });

    // Check Initial Query String
    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get("q") || "";

    if (initialQ) {
      if (catIn) catIn.value = initialQ;
      if (repoIn) repoIn.value = initialQ;
      if (dbIn) dbIn.value = initialQ;
      if (pageIn) pageIn.value = initialQ;

      executeCatalogue(initialQ);
      executeRepository(initialQ);
      executeDatabases(initialQ);
    } else {
      executeCatalogue("");
      executeRepository("");
      executeDatabases("");
    }

    // Sync on tab switch
    document.querySelectorAll(".stabs button").forEach((b) => {
      b.addEventListener("click", () => {
        const paneId = b.getAttribute("data-pane");
        const activeQ = (catIn && catIn.value) || (repoIn && repoIn.value) || (dbIn && dbIn.value) || (pageIn && pageIn.value) || "";
        if (paneId === "paneCat" && catIn) {
          if (!catIn.value && activeQ) catIn.value = activeQ;
          if (catIn.value && !state.cat.totalResults.length) executeCatalogue(catIn.value);
        } else if (paneId === "paneRepo" && repoIn) {
          if (!repoIn.value && activeQ) repoIn.value = activeQ;
          if (repoIn.value && !state.repo.totalResults.length) executeRepository(repoIn.value);
        } else if (paneId === "paneDb" && dbIn) {
          if (!dbIn.value && activeQ) dbIn.value = activeQ;
          executeDatabases(dbIn.value);
        } else if (paneId === "paneSite" && pageIn) {
          if (!pageIn.value && activeQ) pageIn.value = activeQ;
          if (typeof window.drawSiteSearch === "function") {
            window.drawSiteSearch(pageIn.value);
          } else {
            pageIn.dispatchEvent(new Event("input"));
          }
        }
      });
    });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
    window.addEventListener("load", init);
  }
})();
