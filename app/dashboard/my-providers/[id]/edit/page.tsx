"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import {
  getProviderById,
  updateProvider,
} from "@/lib/api/requests/provider.requests";
import { cron2LocalTimeFormat } from "@/lib/utils";
import { sendGAEvent } from "@/lib/analytics";
import { Provider } from "@/lib/api/types/provider.types";

export default function EditProviderPage() {
  const router = useRouter();
  const params = useParams();
  const providerId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [scheduleDisplay, setScheduleDisplay] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      try {
        const response = await getProviderById(providerId);
        const fetchedProvider = response.data;
        if (fetchedProvider) {
          setProvider(fetchedProvider);
          setFormData({
            name: fetchedProvider.title,
            description: fetchedProvider.summary,
          });

          if (fetchedProvider.schedule) {
            setScheduleDisplay("Loading schedule...");
            try {
              const scheduleInfo = cron2LocalTimeFormat(fetchedProvider.schedule);

              if (scheduleInfo) {
                const { weekday, hour, period } = scheduleInfo;
                const weekdayMap: { [key: string]: string } = {
                  SUN: "Sunday",
                  MON: "Monday",
                  TUE: "Tuesday",
                  WED: "Wednesday",
                  THU: "Thursday",
                  FRI: "Friday",
                  SAT: "Saturday",
                };
                const weekdayLabel = weekdayMap[weekday.toUpperCase()] || weekday;
                setScheduleDisplay(`${weekdayLabel} at ${hour}:00 ${period}`);
              } else {
                setScheduleDisplay("Invalid schedule format");
              }
            } catch (parseError) {
              console.error("Error parsing schedule:", parseError);
              toast({
                title: "Warning",
                description: "Could not parse the existing schedule.",
                variant: "default",
              });
              setScheduleDisplay("Could not load schedule");
            }
          }
        } else {
          toast({
            title: "Error",
            description: "Provider not found.",
            variant: "destructive",
          });
          router.push("/dashboard/my-providers");
        }
      } catch (error) {
        console.error("Error fetching provider:", error);
        toast({
          title: "Error",
          description: "Failed to fetch provider details. Please try again.",
          variant: "destructive",
        });
        router.push("/dashboard/my-providers");
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProvider();
    }
  }, [providerId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when field is edited
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Provider name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for submission
      const providerData = {
        providerId: providerId,
        title: formData.name,
        summary: formData.description,
      };

      await updateProvider(providerData);

      // Send create_provider event
      sendGAEvent("update_provider", {
        provider_title: providerData.title,
        schedule: provider?.schedule,
      });

      toast({
        title: "Success",
        description: "Provider updated successfully!",
      });

      // Redirect to providers list
      router.push("/dashboard/my-providers");
    } catch (error) {
      console.error("Error updating provider:", error);
      toast({
        title: "Error",
        description: "Failed to update provider. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex justify-center items-center">
        <p>Loading provider details...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Provider</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold">Provider Details</h3>
                <p className="text-sm text-muted-foreground">
                  Edit the details for your newsletter provider.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className={errors.name ? "text-destructive" : ""}
                  >
                    Provider Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Tech Insights Weekly"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className={errors.description ? "text-destructive" : ""}
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your newsletter is about..."
                    className={`min-h-[100px] ${
                      errors.description ? "border-destructive" : ""
                    }`}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label className={errors.tags ? "text-destructive" : ""}>
                        Tags (Free plan: up to 2)
                      </Label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                    {provider?.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs py-0.5 pl-2 pr-1 flex items-center gap-1 h-7 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {errors.tags && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.tags}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Sending Schedule (Weekly)
                  </Label>
                  <div className="mt-2 p-3 bg-slate-50 rounded-md min-h-[40px]">
                    <p className="text-sm text-muted-foreground">
                      {scheduleDisplay ? (
                        <>
                          Current schedule: <span className="font-medium text-foreground">{scheduleDisplay}</span>
                        </>
                      ) : (
                        "Loading schedule..."
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    The newsletter schedule cannot be changed after creation.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/dashboard/my-providers")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting ? "Updating..." : "Update Provider"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
