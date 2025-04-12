"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  FileText,
  Image,
  Globe,
  Upload,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Mock content data
const MOCK_CONTENT = [
  {
    id: "1",
    title: "Welcome to Coinvoice",
    type: "page",
    status: "published",
    author: "Admin User",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-03-20T14:45:00Z",
    slug: "/welcome",
  },
  {
    id: "2",
    title: "How Invoice Tokenization Works",
    type: "article",
    status: "published",
    author: "John Doe",
    createdAt: "2025-02-10T09:15:00Z",
    updatedAt: "2025-02-10T09:15:00Z",
    slug: "/blog/invoice-tokenization",
  },
  {
    id: "3",
    title: "Marketplace Guide",
    type: "guide",
    status: "published",
    author: "Admin User",
    createdAt: "2025-02-25T11:30:00Z",
    updatedAt: "2025-03-15T16:20:00Z",
    slug: "/guides/marketplace",
  },
  {
    id: "4",
    title: "Privacy Policy",
    type: "legal",
    status: "published",
    author: "Admin User",
    createdAt: "2025-01-01T08:00:00Z",
    updatedAt: "2025-04-01T10:10:00Z",
    slug: "/privacy-policy",
  },
  {
    id: "5",
    title: "Upcoming Features",
    type: "article",
    status: "draft",
    author: "John Doe",
    createdAt: "2025-04-05T13:45:00Z",
    updatedAt: "2025-04-05T13:45:00Z",
    slug: "/blog/upcoming-features",
  },
  {
    id: "6",
    title: "Terms of Service",
    type: "legal",
    status: "published",
    author: "Admin User",
    createdAt: "2025-01-01T08:30:00Z",
    updatedAt: "2025-04-01T10:15:00Z",
    slug: "/terms-of-service",
  },
]

// Mock FAQ data
const MOCK_FAQS = [
  {
    id: "1",
    question: "What is invoice tokenization?",
    answer:
      "Invoice tokenization is the process of converting traditional invoices into digital tokens on a blockchain, making them tradable assets.",
    category: "general",
    status: "published",
    createdAt: "2025-01-20T09:30:00Z",
  },
  {
    id: "2",
    question: "How do I create an account?",
    answer: "To create an account, click on the 'Sign Up' button on the homepage and follow the registration process.",
    category: "account",
    status: "published",
    createdAt: "2025-01-25T11:15:00Z",
  },
  {
    id: "3",
    question: "What fees are associated with trading invoice tokens?",
    answer:
      "Trading fees are typically 0.5% of the transaction value, with discounts available based on your CoinPoints balance.",
    category: "marketplace",
    status: "published",
    createdAt: "2025-02-05T14:20:00Z",
  },
  {
    id: "4",
    question: "How are invoice tokens verified?",
    answer:
      "Invoice tokens undergo a rigorous verification process using AI and manual review to ensure authenticity before being listed on the marketplace.",
    category: "general",
    status: "published",
    createdAt: "2025-02-10T10:45:00Z",
  },
  {
    id: "5",
    question: "Can I withdraw my funds at any time?",
    answer:
      "Yes, you can withdraw your funds at any time, subject to standard blockchain confirmation times and network fees.",
    category: "payments",
    status: "published",
    createdAt: "2025-03-15T13:30:00Z",
  },
]

// Mock media data
const MOCK_MEDIA = [
  {
    id: "1",
    name: "hero-image.jpg",
    type: "image",
    size: "1.2 MB",
    dimensions: "1920x1080",
    uploadedBy: "Admin User",
    uploadedAt: "2025-01-15T10:30:00Z",
    url: "/placeholder.svg?height=1080&width=1920",
  },
  {
    id: "2",
    name: "marketplace-screenshot.png",
    type: "image",
    size: "850 KB",
    dimensions: "1600x900",
    uploadedBy: "John Doe",
    uploadedAt: "2025-02-10T09:15:00Z",
    url: "/placeholder.svg?height=900&width=1600",
  },
  {
    id: "3",
    name: "coinvoice-logo.svg",
    type: "image",
    size: "45 KB",
    dimensions: "512x512",
    uploadedBy: "Admin User",
    uploadedAt: "2025-01-01T08:00:00Z",
    url: "/placeholder.svg?height=512&width=512",
  },
  {
    id: "4",
    name: "whitepaper.pdf",
    type: "document",
    size: "3.5 MB",
    dimensions: "N/A",
    uploadedBy: "Admin User",
    uploadedAt: "2025-01-10T11:45:00Z",
    url: "#",
  },
  {
    id: "5",
    name: "how-it-works.mp4",
    type: "video",
    size: "24.8 MB",
    dimensions: "1920x1080",
    uploadedBy: "John Doe",
    uploadedAt: "2025-03-05T14:30:00Z",
    url: "#",
  },
]

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("pages")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContent, setSelectedContent] = useState<typeof MOCK_CONTENT[0] | null>(null)
  const [selectedFaq, setSelectedFaq] = useState<typeof MOCK_FAQS[0] | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<typeof MOCK_MEDIA[0] | null>(null)
  const [isEditContentDialogOpen, setIsEditContentDialogOpen] = useState(false)
  const [isDeleteContentDialogOpen, setIsDeleteContentDialogOpen] = useState(false)
  const [isCreateContentDialogOpen, setIsCreateContentDialogOpen] = useState(false)
  const [isEditFaqDialogOpen, setIsEditFaqDialogOpen] = useState(false)
  const [isDeleteFaqDialogOpen, setIsDeleteFaqDialogOpen] = useState(false)
  const [isCreateFaqDialogOpen, setIsCreateFaqDialogOpen] = useState(false)
  const [isViewMediaDialogOpen, setIsViewMediaDialogOpen] = useState(false)
  const [isDeleteMediaDialogOpen, setIsDeleteMediaDialogOpen] = useState(false)
  const [isUploadMediaDialogOpen, setIsUploadMediaDialogOpen] = useState(false)
  const { toast } = useToast()
  
  // Filter content based on search query and active tab
  const filteredContent = MOCK_CONTENT.filter(content => 
    (content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  // Filter FAQs based on search query
  const filteredFaqs = MOCK_FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Filter media based on search query
  const filteredMedia = MOCK_MEDIA.filter(media => 
    media.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    media.type.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleEditContent = (content: typeof MOCK_CONTENT[0]) => {
    setSelectedContent(content)
    setIsEditContentDialogOpen(true)
  }
  
  const handleDeleteContent = (content: typeof MOCK_CONTENT[0]) => {
    setSelectedContent(content)
    setIsDeleteContentDialogOpen(true)
  }
  
  const confirmDeleteContent = () => {
    if (!selectedContent) return
    
    setIsDeleteContentDialogOpen(false)
    
    toast({
      title: "Content Deleted",
      description: `"${selectedContent.title}" has been deleted successfully.`,
    })
  }
  
  const handleEditFaq = (faq: typeof MOCK_FAQS[0]) => {
    setSelectedFaq(faq)
    setIsEditFaqDialogOpen(true)
  }
  
  const handleDeleteFaq = (faq: typeof MOCK_FAQS[0]) => {
    setSelectedFaq(faq)
    setIsDeleteFaqDialogOpen(true)
  }
  
  const confirmDeleteFaq = () => {
    if (!selectedFaq) return
    
    setIsDeleteFaqDialogOpen(false)
    
    toast({
      title: "FAQ Deleted",
      description: "The FAQ has been deleted successfully.",
    })
  }
  
  const handleViewMedia = (media: typeof MOCK_MEDIA[0]) => {
    setSelectedMedia(media)
    setIsViewMediaDialogOpen(true)
  }
  
  const handleDeleteMedia = (media: typeof MOCK_MEDIA[0]) => {
    setSelectedMedia(media)
    setIsDeleteMediaDialogOpen(true)
  }
  
  const confirmDeleteMedia = () => {
    if (!selectedMedia) return
    
    setIsDeleteMediaDialogOpen(false)
    
    toast({
      title: "Media Deleted",
      description: `"${selectedMedia.name}" has been deleted successfully.`,
    })
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }
  
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "page":
        return <Globe className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "guide":
        return <FileText className="h-4 w-4" />
      case "legal":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }
  
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "video":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">
            Manage your platform's content, FAQs, and media assets.
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="pages">Pages & Articles</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab}...`}
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {activeTab === "pages" && (
              <Button onClick={() => setIsCreateContentDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Content
              </Button>
            )}
            
            {activeTab === "faqs" && (
              <Button onClick={() => setIsCreateFaqDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New FAQ
              </Button>
            )}
            
            {activeTab === "media" && (
              <Button onClick={() => setIsUploadMediaDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            )}
          </div>
        </div>
        
        <TabsContent value="pages" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No content found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div className="font-medium">{content.title}</div>
                          <div className="text-xs text-muted-foreground">{content.slug}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {getContentTypeIcon(content.type)}
                            <span>{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={content.status === "published" ? "default" : "outline"}
                            className={content.status === "published" ? "" : "border-amber-500 text-amber-500"}
                          >
                            {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{content.author}</TableCell>
                        <TableCell>{formatDate(content.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditContent(content)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteContent(content)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredContent.length}</strong> of <strong>{MOCK_CONTENT.length}</strong> items
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="faqs" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaqs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No FAQs found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFaqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell>
                          <div className="font-medium">{faq.question}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[300px]">{faq.answer}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="w-fit">
                            {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={faq.status === "published" ? "default" : "outline"}
                            className={faq.status === "published" ? "" : "border-amber-500 text-amber-500"}
                          >
                            {faq.status.charAt(0).toUpperCase() + faq.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(faq.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditFaq(faq)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteFaq(faq)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredFaqs.length}</strong> of <strong>{MOCK_FAQS.length}</strong> FAQs
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="media" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Uploaded On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedia.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No media found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMedia.map((media) => (
                      <TableRow key={media.id}>
                        <TableCell>
                          <div className="font-medium">{media.name}</div>
                          {media.type === "image" && (
                            <div className="text-xs text-muted-foreground">{media.dimensions}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {getMediaTypeIcon(media.type)}
                            <span>{media.type.charAt(0).toUpperCase() + media.type.slice(1)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{media.size}</TableCell>
                        <TableCell>{media.uploadedBy}</TableCell>
                        <TableCell>{formatDate(media.uploadedAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewMedia(media)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteMedia(media)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredMedia.length}</strong> of <strong>{MOCK_MEDIA.length}</strong> media files
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Content Dialog */}
      <Dialog open={isEditContentDialogOpen} onOpenChange={setIsEditContentDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Update content information and settings.
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input id="edit-title" defaultValue={selectedContent.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input id="edit-slug" defaultValue={selectedContent.slug} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Content Type</Label>
                  <Select defaultValue={selectedContent.type}>
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page">Page</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedContent.status}>
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea 
                  id="edit-content" 
                  placeholder="Enter content here..." 
                  className="min-h-[200px]"
                  defaultValue="This is the content of the page. In a real application, this would be a rich text editor."
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditContentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setIsEditContentDialogOpen(false)
                    toast({
                      title: "Content Updated",
                      description: `"${selectedContent.title}" has been updated successfully.`,
                    })
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Content Dialog */}
      <Dialog open={isDeleteContentDialogOpen} onOpenChange={setIsDeleteContentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border">
                <div className="font-medium">{selectedContent.title}</div>
                <div className="text-sm text-muted-foreground">{selectedContent.slug}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={selectedContent.status === "published" ? "default" : "outline"}
                    className={selectedContent.status === "published" ? "" : "border-amber-500 text-amber-500"}
                  >
                    {selectedContent.status.charAt(0).toUpperCase() + selectedContent.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getContentTypeIcon(selectedContent.type)}
                    <span>{selectedContent.type.charAt(0).toUpperCase() + selectedContent.type.slice(1)}</span>
                  </Badge>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteContentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteContent}>
                  Delete Content
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create Content Dialog */}
      <Dialog open={isCreateContentDialogOpen} onOpenChange={setIsCreateContentDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
            <DialogDescription>
              Add new content to your platform.
            </DialogDescription>
          </DialogHeader>
          
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-title">Title</Label>
                <Input id="create-title" placeholder="Enter title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-slug">Slug</Label>
                <Input id="create-slug" placeholder="/your-content-slug" required />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-type">Content Type</Label>
                <Select defaultValue="page">
                  <SelectTrigger id="create-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-status">Status</Label>
                <Select defaultValue="draft">
                  <SelectTrigger id="create-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-content">Content</Label>
              <Textarea 
                id="create-content" 
                placeholder="Enter content here..." 
                className="min-h-[200px]"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateContentDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={() => {
                  setIsCreateContentDialogOpen(false)
                  toast({
                    title: "Content Created",
                    description: "New content has been created successfully.",
                  })
                }}
              >
                Create Content
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit FAQ Dialog */}
      <Dialog open={isEditFaqDialogOpen} onOpenChange={setIsEditFaqDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update FAQ information.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFaq && (
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-question">Question</Label>
                <Input id="edit-question" defaultValue={selectedFaq.question} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-answer">Answer</Label>
                <Textarea 
                  id="edit-answer" 
                  defaultValue={selectedFaq.answer}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select defaultValue={selectedFaq.category}>
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="payments">Payments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-faq-status">Status</Label>
                  <Select defaultValue={selectedFaq.status}>
                    <SelectTrigger id="edit-faq-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditFaqDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setIsEditFaqDialogOpen(false)
                    toast({
                      title: "FAQ Updated",
                      description: "The FAQ has been updated successfully.",
                    })
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete FAQ Dialog */}
      <Dialog open={isDeleteFaqDialogOpen} onOpenChange={setIsDeleteFaqDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFaq && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border">
                <div className="font-medium">{selectedFaq.question}</div>
                <div className="text-sm text-muted-foreground mt-2">{selectedFaq.answer}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {selectedFaq.category.charAt(0).toUpperCase() + selectedFaq.category.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteFaqDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteFaq}>
                  Delete FAQ
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create FAQ Dialog */}
      <Dialog open={isCreateFaqDialogOpen} onOpenChange={setIsCreateFaqDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New FAQ</DialogTitle>
            <DialogDescription>
              Add a new frequently asked question to your platform.
            </DialogDescription>
          </DialogHeader>
          
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-question">Question</Label>
              <Input id="create-question" placeholder="Enter question" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-answer">Answer</Label>
              <Textarea 
                id="create-answer" 
                placeholder="Enter answer"
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-category">Category</Label>
                <Select defaultValue="general">
                  <SelectTrigger id="create-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-faq-status">Status</Label>
                <Select defaultValue="published">
                  <SelectTrigger id="create-faq-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateFaqDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={() => {
                  setIsCreateFaqDialogOpen(false)
                  toast({
                    title: "FAQ Created",
                    description: "New FAQ has been created successfully.",
                  })
                }}
              >
                Create FAQ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Media Dialog */}
      <Dialog open={isViewMediaDialogOpen} onOpenChange={setIsViewMediaDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Media Preview</DialogTitle>
            <DialogDescription>
              {selectedMedia?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMedia && (
            <div className="space-y-4">
              {selectedMedia.type === "image" ? (
                <div className="flex justify-center">
                  <img 
                    src={selectedMedia.url || "/placeholder.svg"} 
                    alt={selectedMedia.name}
                    className="max-h-[400px] object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-md">
                  {selectedMedia.type === "document" ? (
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  ) : (
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  )}
                  <p className="text-muted-foreground">Preview not available for this file type</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">File Details</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{selectedMedia.type.charAt(0).toUpperCase() + selectedMedia.type.slice(1)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{selectedMedia.size}</span>
                    </li>
                    {selectedMedia.dimensions !== "N/A" && (
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span>{selectedMedia.dimensions}</span>
                      </li>
                    )}
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Uploaded by:</span>
                      <span>{selectedMedia.uploadedBy}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Upload date:</span>
                      <span>{formatDate(selectedMedia.uploadedAt)}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">File URL</p>
                  <div className="mt-2 flex">
                    <Input value={selectedMedia.url} readOnly className="flex-1" />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedMedia.url)
                        toast({
                          title: "URL Copied",\
                          description: "File URL
