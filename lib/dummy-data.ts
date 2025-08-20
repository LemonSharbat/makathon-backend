export interface Complaint {
  id: string
  title: string
  description: string
  location: string
  photo?: string
  status: "Pending" | "Resolved"
  assignedWorker?: string
  createdAt: Date
  resolvedAt?: Date
  afterPhoto?: string
  deadline?: Date
}

export interface Worker {
  id: string
  name: string
  email: string
}

export const dummyWorkers: Worker[] = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh@waste.gov" },
  { id: "2", name: "Priya Sharma", email: "priya@waste.gov" },
  { id: "3", name: "Amit Singh", email: "amit@waste.gov" },
]

export const dummyComplaints: Complaint[] = [
  {
    id: "1",
    title: "Overflowing Garbage Bin",
    description: "The garbage bin near the market is overflowing and creating a mess. Urgent attention needed.",
    location: "Main Market, Sector 15",
    photo: "/overflowing-garbage-bin.png",
    status: "Pending",
    assignedWorker: "Rajesh Kumar",
    createdAt: new Date("2024-01-15"),
    deadline: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "Illegal Dumping",
    description: "Construction waste has been illegally dumped in the park area.",
    location: "Green Park, Sector 22",
    photo: "/illegal-construction-waste.png",
    status: "Resolved",
    assignedWorker: "Priya Sharma",
    createdAt: new Date("2024-01-10"),
    resolvedAt: new Date("2024-01-14"),
    afterPhoto: "/clean-park-after-cleanup.png",
  },
  {
    id: "3",
    title: "Broken Waste Container",
    description: "The waste container is broken and garbage is scattered around.",
    location: "Bus Stop, Main Road",
    photo: "/broken-waste-container.png",
    status: "Pending",
    assignedWorker: "Amit Singh",
    createdAt: new Date("2024-01-12"),
    deadline: new Date("2024-01-18"),
  },
  {
    id: "4",
    title: "Plastic Waste Accumulation",
    description: "Large amount of plastic waste has accumulated near the river bank.",
    location: "River Bank, East Side",
    photo: "/plastic-waste-riverbank.png",
    status: "Resolved",
    assignedWorker: "Rajesh Kumar",
    createdAt: new Date("2024-01-08"),
    resolvedAt: new Date("2024-01-13"),
    afterPhoto: "/clean-river-bank.png",
  },
  {
    id: "5",
    title: "Medical Waste Disposal",
    description: "Medical waste found disposed improperly near residential area.",
    location: "Residential Colony, Block A",
    photo: "/improper-medical-waste.png",
    status: "Pending",
    assignedWorker: "Priya Sharma",
    createdAt: new Date("2024-01-14"),
    deadline: new Date("2024-01-19"),
  },
]

export const getComplaintsByArea = () => {
  const areas = dummyComplaints.reduce(
    (acc, complaint) => {
      const area = complaint.location.split(",")[1]?.trim() || complaint.location
      acc[area] = (acc[area] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(areas).map(([area, count]) => ({ area, count }))
}

export const getStatusCounts = () => {
  const pending = dummyComplaints.filter((c) => c.status === "Pending").length
  const resolved = dummyComplaints.filter((c) => c.status === "Resolved").length
  return { pending, resolved }
}

export const getFrequentDumpingSpots = () => {
  const locations = dummyComplaints.reduce(
    (acc, complaint) => {
      acc[complaint.location] = (acc[complaint.location] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(locations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }))
}
