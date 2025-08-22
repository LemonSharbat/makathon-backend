"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, CheckCircle, Clock } from "lucide-react"

export function CitizenInterface() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    photo: null as File | null,
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [complaints, setComplaints] = useState<any[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.title && formData.description && formData.location) {
      try {
        let photoUrl = null

        if (formData.photo) {
          // Upload photo to the correct bucket name
          const { data: storageData, error: storageError } = await supabase.storage
            .from("complaint-photos") // ✅ Changed to correct bucket name
            .upload(`complaints/${Date.now()}-${formData.photo.name}`, formData.photo)

          if (storageError) throw storageError

          // Get public URL from the correct bucket
          const { data: publicUrlData } = supabase.storage
            .from("complaint-photos") // ✅ Changed to correct bucket name
            .getPublicUrl(storageData.path)

          photoUrl = publicUrlData.publicUrl
        }

        const { error } = await supabase.from("complaints").insert([
          {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            photo: photoUrl,
            status: "Pending",
            createdAt: new Date(),
          },
        ])

        if (error) throw error

        setShowConfirmation(true)
        setTimeout(() => {
          setFormData({ title: "", description: "", location: "", photo: null })
          setPhotoPreview(null)
          setShowConfirmation(false)
        }, 3000)

        fetchComplaints()
      } catch (err) {
        console.error("Error submitting report:", err)
      }
    }
  }

  const fetchComplaints = async () => {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("createdAt", { ascending: false })

    if (error) {
      console.error("Error fetching complaints:", error)
    } else {
      setComplaints(data || [])
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const getStatusIcon = (status: string) => {
    return status === "Resolved" ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <Clock className="h-4 w-4 text-orange-500" />
    )
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        variant={status === "Resolved" ? "default" : "secondary"}
        className="flex items-center gap-1"
      >
        {getStatusIcon(status)}
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Report Waste Issues</h2>
        <p className="text-muted-foreground">
          Help keep our community clean by reporting waste problems
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Submit New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showConfirmation ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Report Submitted Successfully!
              </h3>
              <p className="text-muted-foreground">
                Thank you for helping keep our community clean. Your report has been received
                and will be reviewed shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the waste issue"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter the location of the waste issue"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Upload Photo (Optional)</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="cursor-pointer"
                />
                {photoPreview && (
                  <div className="mt-2">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full max-w-xs h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                Submit Report
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Recent Reports</h3>
          <p className="text-muted-foreground">View all waste reports from the community</p>
        </div>

        <div className="grid gap-6">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="md:flex">
                  {complaint.photo && (
                    <div className="md:w-1/3">
                      <img
                        src={complaint.photo}
                        alt={complaint.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`p-6 ${complaint.photo ? "md:w-2/3" : "w-full"}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-foreground">
                        {complaint.title}
                      </h4>
                      {getStatusBadge(complaint.status)}
                    </div>

                    <p className="text-muted-foreground mb-3">
                      {complaint.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      {complaint.location}
                    </div>

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>
                        Reported:{" "}
                        {complaint.createdAt
                          ? new Date(complaint.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                      {complaint.resolvedAt && (
                        <span>
                          Resolved:{" "}
                          {new Date(complaint.resolvedAt).toLocaleDateString()}
                        </span>
                      )}
                      {complaint.assignedWorker && (
                        <span>Assigned to: {complaint.assignedWorker}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}




















// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { supabase } from "@/lib/supabaseClient" // ✅ ensure supabaseClient.ts is configured with your URL + anon key

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { MapPin, Camera, CheckCircle, Clock } from "lucide-react"

// // ❌ removed dummyComplaints import, we’ll fetch from Supabase instead
// // import { dummyComplaints } from "@/lib/dummy-data"

// export function CitizenInterface() {
//   // ---------------- STATE ----------------
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     location: "",
//     photo: null as File | null,
//   })
//   const [showConfirmation, setShowConfirmation] = useState(false)
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null)

//   // ✅ NEW: state to hold complaints fetched from Supabase
//   const [complaints, setComplaints] = useState<any[]>([])

//   // ---------------- HANDLERS ----------------
//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setFormData((prev) => ({ ...prev, photo: file }))
//       const reader = new FileReader()
//       reader.onload = (e) => setPhotoPreview(e.target?.result as string)
//       reader.readAsDataURL(file)
//     }
//   }

//   // ✅ MODIFIED: submit now inserts into Supabase
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (formData.title && formData.description && formData.location) {
//       try {
//         let photoUrl = null

//         // ✅ If a photo is uploaded, store it in Supabase Storage
//         if (formData.photo) {
//           const { data: storageData, error: storageError } = await supabase.storage
//             .from("complaint-photos") // ensure you have a bucket named 'complaint-photos'
//             .upload(`complaints/${Date.now()}-${formData.photo.name}`, formData.photo)

//           if (storageError) throw storageError
          

//           // Get public URL of uploaded photo
//           const { data: publicUrlData } = supabase.storage
//             .from("photos")
//             .getPublicUrl(storageData.path)

//           photoUrl = publicUrlData.publicUrl
//         }

//         // ✅ Insert complaint into Supabase
//         const { error } = await supabase.from("complaints").insert([
//           {
//             title: formData.title,
//             description: formData.description,
//             location: formData.location,
//             photo: photoUrl, // can be null if no photo
//             status: "Pending",
//             createdAt: new Date(),
//           },
//         ])

//         if (error) throw error

//         setShowConfirmation(true)

//         // Reset form
//         setTimeout(() => {
//           setFormData({ title: "", description: "", location: "", photo: null })
//           setPhotoPreview(null)
//           setShowConfirmation(false)
//         }, 3000)

//         // ✅ Refresh complaints feed after insert
//         fetchComplaints()
//       } catch (err) {
//         console.error("Error submitting report:", err)
//       }
//     }
//   }

//   // ✅ NEW: fetch complaints from Supabase
//   const fetchComplaints = async () => {
//     const { data, error } = await supabase
//       .from("complaints")
//       .select("*")
//       .order("createdAt", { ascending: false }) // latest first

//     if (error) {
//       console.error("Error fetching complaints:", error)
//     } else {
//       setComplaints(data || [])
//     }
//   }

//   // ✅ Fetch complaints on component load
//   useEffect(() => {
//     fetchComplaints()
//   }, [])

//   // ---------------- HELPERS ----------------
//   const getStatusIcon = (status: string) => {
//     return status === "Resolved" ? (
//       <CheckCircle className="h-4 w-4 text-green-600" />
//     ) : (
//       <Clock className="h-4 w-4 text-orange-500" />
//     )
//   }

//   const getStatusBadge = (status: string) => {
//     return (
//       <Badge
//         variant={status === "Resolved" ? "default" : "secondary"}
//         className="flex items-center gap-1"
//       >
//         {getStatusIcon(status)}
//         {status}
//       </Badge>
//     )
//   }

//   // ---------------- UI ----------------
//   return (
//     <div className="space-y-8">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold text-foreground mb-2">Report Waste Issues</h2>
//         <p className="text-muted-foreground">
//           Help keep our community clean by reporting waste problems
//         </p>
//       </div>

//       {/* Report Form */}
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Camera className="h-5 w-5 text-primary" />
//             Submit New Report
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {showConfirmation ? (
//             <div className="text-center py-8">
//               <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-foreground mb-2">
//                 Report Submitted Successfully!
//               </h3>
//               <p className="text-muted-foreground">
//                 Thank you for helping keep our community clean. Your report has been received
//                 and will be reviewed shortly.
//               </p>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Title</Label>
//                 <Input
//                   id="title"
//                   placeholder="Brief description of the issue"
//                   value={formData.title}
//                   onChange={(e) => handleInputChange("title", e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Provide detailed information about the waste issue"
//                   value={formData.description}
//                   onChange={(e) => handleInputChange("description", e.target.value)}
//                   rows={4}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location">Location</Label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="location"
//                     placeholder="Enter the location of the waste issue"
//                     value={formData.location}
//                     onChange={(e) => handleInputChange("location", e.target.value)}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="photo">Upload Photo (Optional)</Label>
//                 <Input
//                   id="photo"
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   className="cursor-pointer"
//                 />
//                 {photoPreview && (
//                   <div className="mt-2">
//                     <img
//                       src={photoPreview || "/placeholder.svg"}
//                       alt="Preview"
//                       className="w-full max-w-xs h-32 object-cover rounded-lg border"
//                     />
//                   </div>
//                 )}
//               </div>

//               <Button type="submit" className="w-full">
//                 Submit Report
//               </Button>
//             </form>
//           )}
//         </CardContent>
//       </Card>

//       {/* Complaints Feed */}
//       <div className="space-y-6">
//         <div className="text-center">
//           <h3 className="text-xl font-semibold text-foreground mb-2">Recent Reports</h3>
//           <p className="text-muted-foreground">View all waste reports from the community</p>
//         </div>

//         <div className="grid gap-6">
//           {complaints.map((complaint) => (
//             <Card key={complaint.id} className="overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="md:flex">
//                   {complaint.photo && (
//                     <div className="md:w-1/3">
//                       <img
//                         src={complaint.photo || "/placeholder.svg"}
//                         alt={complaint.title}
//                         className="w-full h-48 md:h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <div
//                     className={`p-6 ${complaint.photo ? "md:w-2/3" : "w-full"}`}
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <h4 className="text-lg font-semibold text-foreground">
//                         {complaint.title}
//                       </h4>
//                       {getStatusBadge(complaint.status)}
//                     </div>

//                     <p className="text-muted-foreground mb-3">
//                       {complaint.description}
//                     </p>

//                     <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
//                       <MapPin className="h-4 w-4" />
//                       {complaint.location}
//                     </div>

//                     <div className="flex justify-between items-center text-sm text-muted-foreground">
//                       <span>
//                         Reported:{" "}
//                         {complaint.createdAt
//                           ? new Date(complaint.createdAt).toLocaleDateString()
//                           : ""}
//                       </span>
//                       {complaint.resolvedAt && (
//                         <span>
//                           Resolved:{" "}
//                           {new Date(complaint.resolvedAt).toLocaleDateString()}
//                         </span>
//                       )}
//                       {complaint.assignedWorker && (
//                         <span>Assigned to: {complaint.assignedWorker}</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }











// "use client"

// import type React from "react"
// import { supabase } from "@/lib/supabaseClient"
// import { useState, useEffect } from "react"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { MapPin, Camera, CheckCircle, Clock } from "lucide-react"

// // import { dummyComplaints } from "@/lib/dummy-data"

// export function CitizenInterface() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     location: "",
//     photo: null as File | null,
//   })
//   const [showConfirmation, setShowConfirmation] = useState(false)
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null)


//   const [complaints, setComplaints] = useState<any[]>([])
//   const fetchComplaints = async () => {
//     const { data, error } = await supabase.from("complaints").select("*").order("created_at", { ascending: false })
//     if (error) {
//       console.error("Error fetching complaints:", error)
//     } else {
//       setComplaints(data || [])
//     }
//   }


//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setFormData((prev) => ({ ...prev, photo: file }))
//       const reader = new FileReader()
//       reader.onload = (e) => setPhotoPreview(e.target?.result as string)
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (formData.title && formData.description && formData.location) {
//       // Insert into Supabase
//       const { data, error } = await supabase.from("complaints").insert([
//         {
//           title: formData.title,
//           description: formData.description,
//           location: formData.location,
//           // photo: we’ll skip file upload for now (needs storage bucket)
//         },
//       ])

//       if (error) {
//         console.error("Error inserting complaint:", error.message)
//         return
//       }

//       console.log("Inserted complaint:", data)

//       setShowConfirmation(true)

//       // Refresh complaints list
//       fetchComplaints()

//       // Reset form after 3 seconds
//       setTimeout(() => {
//         setFormData({ title: "", description: "", location: "", photo: null })
//         setPhotoPreview(null)
//         setShowConfirmation(false)
//       }, 3000)
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     return status === "Resolved" ? (
//       <CheckCircle className="h-4 w-4 text-green-600" />
//     ) : (
//       <Clock className="h-4 w-4 text-orange-500" />
//     )
//   }

//   const getStatusBadge = (status: string) => {
//     return (
//       <Badge variant={status === "Resolved" ? "default" : "secondary"} className="flex items-center gap-1">
//         {getStatusIcon(status)}
//         {status}
//       </Badge>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold text-foreground mb-2">Report Waste Issues</h2>
//         <p className="text-muted-foreground">Help keep our community clean by reporting waste problems</p>
//       </div>

//       {/* Report Form */}
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Camera className="h-5 w-5 text-primary" />
//             Submit New Report
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {showConfirmation ? (
//             <div className="text-center py-8">
//               <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-foreground mb-2">Report Submitted Successfully!</h3>
//               <p className="text-muted-foreground">
//                 Thank you for helping keep our community clean. Your report has been received and will be reviewed
//                 shortly.
//               </p>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Title</Label>
//                 <Input
//                   id="title"
//                   placeholder="Brief description of the issue"
//                   value={formData.title}
//                   onChange={(e) => handleInputChange("title", e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Provide detailed information about the waste issue"
//                   value={formData.description}
//                   onChange={(e) => handleInputChange("description", e.target.value)}
//                   rows={4}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location">Location</Label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="location"
//                     placeholder="Enter the location of the waste issue"
//                     value={formData.location}
//                     onChange={(e) => handleInputChange("location", e.target.value)}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="photo">Upload Photo (Optional)</Label>
//                 <Input
//                   id="photo"
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   className="cursor-pointer"
//                 />
//                 {photoPreview && (
//                   <div className="mt-2">
//                     <img
//                       src={photoPreview || "/placeholder.svg"}
//                       alt="Preview"
//                       className="w-full max-w-xs h-32 object-cover rounded-lg border"
//                     />
//                   </div>
//                 )}
//               </div>

//               <Button type="submit" className="w-full">
//                 Submit Report
//               </Button>
//             </form>
//           )}
//         </CardContent>
//       </Card>

//       {/* Complaints Feed */}
//       <div className="space-y-6">
//         <div className="text-center">
//           <h3 className="text-xl font-semibold text-foreground mb-2">Recent Reports</h3>
//           <p className="text-muted-foreground">View all waste reports from the community</p>
//         </div>

//         <div className="grid gap-6">
//           {dummyComplaints.map((complaint) => (
//             <Card key={complaint.id} className="overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="md:flex">
//                   {complaint.photo && (
//                     <div className="md:w-1/3">
//                       <img
//                         src={complaint.photo || "/placeholder.svg"}
//                         alt={complaint.title}
//                         className="w-full h-48 md:h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <div className={`p-6 ${complaint.photo ? "md:w-2/3" : "w-full"}`}>
//                     <div className="flex justify-between items-start mb-3">
//                       <h4 className="text-lg font-semibold text-foreground">{complaint.title}</h4>
//                       {getStatusBadge(complaint.status)}
//                     </div>

//                     <p className="text-muted-foreground mb-3">{complaint.description}</p>

//                     <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
//                       <MapPin className="h-4 w-4" />
//                       {complaint.location}
//                     </div>

//                     <div className="flex justify-between items-center text-sm text-muted-foreground">
//                       <span>Reported: {complaint.createdAt.toLocaleDateString()}</span>
//                       {complaint.resolvedAt && <span>Resolved: {complaint.resolvedAt.toLocaleDateString()}</span>}
//                       {complaint.assignedWorker && <span>Assigned to: {complaint.assignedWorker}</span>}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
