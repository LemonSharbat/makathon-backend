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

export interface PanchayatPerformance {
  id: string
  name: string
  location: string
  resolvedCount: number
  unaddressedCount: number
  totalComplaints: number
  resolutionRate: number
  averageResolutionTime: number // in days
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

export const dummyPanchayatPerformance: PanchayatPerformance[] = [
  {
    id: "1",
    name: "Surathkal Panchayat",
    location: "Surathkal",
    resolvedCount: 45,
    unaddressedCount: 12,
    totalComplaints: 57,
    resolutionRate: 78.9,
    averageResolutionTime: 4.2,
  },
  {
    id: "2",
    name: "Mulki Panchayat",
    location: "Mulki",
    resolvedCount: 38,
    unaddressedCount: 8,
    totalComplaints: 46,
    resolutionRate: 82.6,
    averageResolutionTime: 3.8,
  },
  {
    id: "3",
    name: "Ullal Panchayat",
    location: "Ullal",
    resolvedCount: 52,
    unaddressedCount: 18,
    totalComplaints: 70,
    resolutionRate: 74.3,
    averageResolutionTime: 5.1,
  },
  {
    id: "4",
    name: "Moodbidri Panchayat",
    location: "Moodbidri",
    resolvedCount: 41,
    unaddressedCount: 6,
    totalComplaints: 47,
    resolutionRate: 87.2,
    averageResolutionTime: 3.2,
  },
  {
    id: "5",
    name: "Bantwal Panchayat",
    location: "Bantwal",
    resolvedCount: 29,
    unaddressedCount: 15,
    totalComplaints: 44,
    resolutionRate: 65.9,
    averageResolutionTime: 6.3,
  },
  {
    id: "6",
    name: "Puttur Panchayat",
    location: "Puttur",
    resolvedCount: 35,
    unaddressedCount: 9,
    totalComplaints: 44,
    resolutionRate: 79.5,
    averageResolutionTime: 4.7,
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
      acc[complaint.location] = (acc[complaint.location] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  // Convert the object to an array of { location, count }
  return Object.entries(locations).map(([location, count]) => ({
    location,
    count,
  }));
};
