import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast.js"
import Navbar from "@/components/Navbar"

const CATEGORIES = ["Medical", "Personal", "Emergency", "Charity", "Education"]

export default function CreateCampaign() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm({
        defaultValues: {
            creator_id: 4, //fetching from backend
            title: "",
            description: "",
            category: "",
            goal_amount: "",
            start_date: new Date(),
            end_date: undefined,
            image: null,
        },
    })
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            console.log("Campaign Data:", data);

            const response = await fetch(`${backendUrl}/campaigns/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    creator_id: data.creator_id,
                    title: data.title,
                    description: data.description,
                    goal_amount: data.goal_amount,
                    image: data.image,
                    category: data.category,
                    raised_amount: 0,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    status: "pending",
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "Campaign Created!",
                    description: "Your campaign has been submitted for approval.",
                });
                setTimeout(() => {
                    navigate('/')
                }, 2000);
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to create campaign.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error creating campaign:", error);
            toast({
                title: "Error",
                description: "Something went wrong while creating the campaign.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <Navbar />
            <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
                {/* Header Back Button */}
                <div className="container mx-auto px-4 max-w-6xl py-4">
                    <Button
                        onClick={() => navigate("/")}
                        className="gap-2 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Main Form Section */}
                <div className="flex-1 flex items-center -mt-8 justify-center">
                    <Card className="w-full max-w-6xl h-[90%] flex flex-col bg-gray-800 text-gray-100 border border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">Create a Campaign</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // stop form submit on Enter
                                        }
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto pr-2"
                                >
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Campaign Title</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            required
                                                            placeholder="Enter title"
                                                            className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Category</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-gray-800 border border-gray-700 text-gray-100">
                                                            {CATEGORIES.map((cat) => (
                                                                <SelectItem
                                                                    key={cat}
                                                                    value={cat}
                                                                    className="hover:bg-gray-700"
                                                                >
                                                                    {cat}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="goal_amount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Funding Goal ($)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            required
                                                            className="bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Date Pickers */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="start_date"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-300">Start Date</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-full bg-gray-900 border-gray-700 text-gray-100 hover:bg-gray-700"
                                                                    >
                                                                        {field.value
                                                                            ? format(field.value, "PPP")
                                                                            : "Pick date"}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="bg-gray-800 border border-gray-700 text-gray-100">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="end_date"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-300">End Date</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-full bg-gray-900 border-gray-700 text-gray-100 hover:bg-gray-700"
                                                                    >
                                                                        {field.value
                                                                            ? format(field.value, "PPP")
                                                                            : "Pick date"}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="bg-gray-800 border border-gray-700 text-gray-100">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="image"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Campaign Image</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            // required
                                                            accept="image/*"
                                                            className="bg-gray-900 border-gray-700 text-gray-100 file:text-gray-200"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const formData = new FormData();
                                                                    formData.append("file", file);
                                                                    formData.append("upload_preset", "CrowdFund-Preset");
                                                                    formData.append("cloud_name", "sajjadahmed");

                                                                    try {
                                                                        const res = await fetch(
                                                                            "https://api.cloudinary.com/v1_1/sajjadahmed/image/upload",
                                                                            {
                                                                                method: "POST",
                                                                                body: formData,
                                                                            }
                                                                        );

                                                                        const data = await res.json();
                                                                        if (data.secure_url) {
                                                                            field.onChange(data.secure_url);
                                                                            toast({
                                                                                title: "Image uploaded",
                                                                                description: "Your image has been uploaded successfully.",
                                                                            });
                                                                        }
                                                                    } catch (err) {
                                                                        console.error("Image upload error:", err);
                                                                        toast({
                                                                            title: "Upload failed",
                                                                            description: "Could not upload the image. Try again.",
                                                                            variant: "destructive",
                                                                        });
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4 flex flex-col">


                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="text-gray-300">Full Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            rows={6}
                                                            className="resize-none bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => navigate("/")}
                                                className="flex-1 bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 bg-blue-600 text-white hover:bg-blue-500"
                                            >
                                                {isSubmitting ? "Creating..." : "Create Campaign"}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>

    )
}
