import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Globe, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Impact } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

// GeoJSON with world countries
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function ImpactMap() {
  const { user } = useAuth();
  const [viewType, setViewType] = useState<"personal" | "collective">("personal");
  const [position, setPosition] = useState({ coordinates: [0, 30], zoom: 1 });

  // Fetch personal impacts
  const {
    data: personalImpacts = [],
    isLoading: isLoadingPersonal,
    error: personalError
  } = useQuery<Impact[]>({
    queryKey: user ? ["/api/users", user.id, "impacts"] : [],
    enabled: !!user && viewType === "personal"
  });

  // Fetch collective impacts
  const {
    data: collectiveImpacts = [],
    isLoading: isLoadingCollective,
    error: collectiveError
  } = useQuery<Impact[]>({
    queryKey: ["/api/impacts/collective"],
    enabled: viewType === "collective"
  });

  const impacts = viewType === "personal" ? personalImpacts : collectiveImpacts;
  const isLoading = viewType === "personal" ? isLoadingPersonal : isLoadingCollective;
  const error = viewType === "personal" ? personalError : collectiveError;

  // Function to handle map zoom
  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  // Calculate impact totals by region
  const impactTotals = impacts.reduce((acc, impact) => {
    const { region, amount } = impact;
    if (!acc[region]) {
      acc[region] = 0;
    }
    acc[region] += amount;
    return acc;
  }, {} as Record<string, number>);

  const regions = Object.keys(impactTotals);

  if (error) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Impact Visualization</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          Error loading impact data. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Impact Visualization</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant={viewType === "personal" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("personal")}
            className="gap-2"
          >
            <User size={16} />
            Personal
          </Button>
          <Button
            variant={viewType === "collective" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("collective")}
            className="gap-2"
          >
            <Globe size={16} />
            Collective
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 h-[400px] bg-muted/10 rounded-md relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading impact data...</p>
              </div>
            ) : (
              <ComposableMap data-tooltip-id="impact-tooltip">
                <ZoomableGroup
                  zoom={position.zoom}
                  center={position.coordinates as [number, number]}
                  onMoveEnd={handleMoveEnd}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#EAEAEC"
                          stroke="#D6D6DA"
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: "#F5F5F5" },
                            pressed: { outline: "none" }
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  {impacts.map((impact, index) => (
                    <Marker
                      key={`marker-${impact.id || index}`}
                      coordinates={[impact.longitude, impact.latitude] as [number, number]}
                      data-tooltip-content={`${impact.location}: ${impact.description}`}
                    >
                      <circle
                        r={4 + (impact.amount / 100)}
                        fill={impact.impactType === "personal" ? "#39ADEA" : "#31C786"}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        opacity={0.8}
                      />
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
            )}
            <Tooltip id="impact-tooltip" />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">
              {viewType === "personal" ? "Your Impact By Region" : "Collective Impact By Region"}
            </h3>
            {regions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No impact data recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {regions.map((region) => (
                  <div key={region} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{region}</span>
                      <span className="text-sm font-medium">{impactTotals[region]} pts</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                        style={{
                          width: `${Math.min(100, (impactTotals[region] / 2000) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-auto">
              <h4 className="text-sm font-medium mb-2">Recent Contributions</h4>
              <div className="space-y-2">
                {impacts.slice(0, 3).map((impact) => (
                  <div
                    key={impact.id}
                    className="text-xs bg-muted/20 p-2 rounded-md"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{impact.location}</span>
                      <Badge
                        variant="outline"
                        className="text-xs ml-2"
                      >
                        +{impact.amount}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-1">
                      {impact.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}