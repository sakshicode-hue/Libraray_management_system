"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, IndianRupee, CheckCircle2 } from "lucide-react"

interface OverdueBook {
    title: string
    dueDate: string
    overdueDays: number
    fineAmount: number
}

interface FinesSummary {
    totalFines: number
    accountCost: number
    overdueBooks: OverdueBook[]
}

export default function FinesPage() {
    const [data, setData] = useState<FinesSummary | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFines = async () => {
            try {
                const userId = localStorage.getItem("user_id") || "1"; // Fallback to '1' or handle auth better
                const res = await fetch(`http://localhost:8000/req/fines/${userId}`)
                if (!res.ok) throw new Error("Failed to fetch")
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchFines()
    }, [])

    if (loading) return <div className="p-10">Loading fines data...</div>

    return (
        <div className="flex flex-col gap-6 p-6">
            <h1 className="text-3xl font-bold">Fines Management</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Accumulated Fines</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            ₹{data?.totalFines || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Total overdue penalties</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Account Cost / Balance</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{data?.accountCost || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Current wallet balance</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Overdue Books Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {!data?.overdueBooks || data.overdueBooks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                            <p>No overdue books! Great job.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Book Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Days Overdue</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Fine Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.overdueBooks.map((book, i) => (
                                        <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{book.title}</td>
                                            <td className="p-4 align-middle">{book.dueDate}</td>
                                            <td className="p-4 align-middle text-red-500 font-bold">{book.overdueDays}</td>
                                            <td className="p-4 align-middle text-right">₹{book.fineAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
