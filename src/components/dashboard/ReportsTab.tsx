import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router";

type MedicalReport = any;

export default function ReportsTab({ medicalReports }: { medicalReports: MedicalReport[] | undefined }) {
  const navigate = useNavigate();

  return (
    <TabsContent value="reports">
      <Card>
        <CardHeader>
          <CardTitle>Medical Reports</CardTitle>
          <CardDescription>Your health consultation reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicalReports?.map((report: any) => (
              <div key={report._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Report #{report.reportId.slice(-8)}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      report.severity === "emergency"
                        ? "bg-red-100 text-red-800"
                        : report.severity === "high"
                        ? "bg-orange-100 text-orange-800"
                        : report.severity === "moderate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Generated: {new Date(report.generatedAt).toLocaleDateString()}</p>
                <div className="text-sm">
                  <p>
                    <strong>Symptoms:</strong> {report.symptoms.join(", ")}
                  </p>
                  <p>
                    <strong>Possible Conditions:</strong> {report.possibleConditions.join(", ")}
                  </p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm">
                    Download PDF
                  </Button>
                  <Button variant="ghost" size="sm">
                    Share with Doctor
                  </Button>
                </div>
              </div>
            ))}
            {(!medicalReports || medicalReports.length === 0) && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No medical reports yet</p>
                <Button onClick={() => navigate("/chat")} className="mt-4">
                  Start a Health Chat
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
