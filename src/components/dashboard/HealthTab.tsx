import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { MapPin, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export default function HealthTab() {
  const navigate = useNavigate();

  return (
    <TabsContent value="health">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Health Alerts & Resources</span>
          </CardTitle>
          <CardDescription>Stay informed about health risks in your area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={() => navigate("/map")} className="w-full flex items-center justify-center space-x-2 h-12">
              <MapPin className="h-5 w-5" />
              <span>View Health Map & Nearby Resources</span>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Seasonal Alert</h3>
                <p className="text-sm text-yellow-700">
                  Flu season is approaching. Consider getting vaccinated and maintain good hygiene practices.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Prevention Tip</h3>
                <p className="text-sm text-blue-700">Wash your hands frequently with soap and water for at least 20 seconds.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
