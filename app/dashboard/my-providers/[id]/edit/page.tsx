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
import { weekday2Cron, cron2LocalTimeFormat } from "@/lib/utils";
import { sendGAEvent } from "@/lib/analytics";
import { Provider } from "@/lib/api/types/provider.types";

const weekdays = [
  { value: "SUN", label: "Sunday" },
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
];

export default function EditProviderPage() {
  const router = useRouter();
  const params = useParams();
  const providerId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

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
            try {
              const { weekday, hour, period } = cron2LocalTimeFormat(
                fetchedProvider.schedule
              );
              setSelectedDay(weekday);
              setSelectedHour(hour);
              setSelectedPeriod(period as "AM" | "PM");
            } catch (parseError) {
              console.error("Error parsing schedule:", parseError);
              toast({
                title: "Warning",
                description: "Could not parse the existing schedule.",
                variant: "default",
              });
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

    if (!selectedDay) {
      newErrors.day = "Please select a sending day";
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

      // Convert 12-hour format to 24-hour format
      const hour24 =
        selectedPeriod === "PM"
          ? selectedHour === 12
            ? 12
            : selectedHour + 12
          : selectedHour === 12
          ? 0
          : selectedHour;

      // Prepare data for submission
      const providerData = {
        providerId: providerId,
        title: formData.name,
        summary: formData.description,
        locale: "En-US",
        schedule: weekday2Cron(selectedDay, hour24),
      };

      await updateProvider(providerData);

      // Send create_provider event
      sendGAEvent("update_provider", {
        provider_title: providerData.title,
        schedule: providerData.schedule,
      });

      toast({
        title: "Success",
        description: "Provider updated successfully!",
      });

      // Redirect to providers list
      router.push("/dashboard/my-providers");
    } catch (error) {
      console.error("Error creating provider:", error);
      toast({
        title: "Error",
        description: "Failed to create provider. Please try again.",
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-muted-foreground"
                        type="button"
                      >
                        <QuestionMarkCircleIcon className="h-4 w-4" />
                      </Button>
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
                  <Label className={errors.day ? "text-destructive" : ""}>
                    Sending Schedule (Weekly)
                  </Label>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Select Day</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2">
                        {weekdays.map((day) => (
                          <Button
                            key={day.value}
                            type="button"
                            size="sm"
                            variant={
                              selectedDay === day.value ? "default" : "outline"
                            }
                            className={`w-full md:w-auto px-3 py-1 h-8 transition-all ${
                              selectedDay === day.value
                                ? "bg-primary text-primary-foreground"
                                : errors.day
                                ? "border-destructive text-destructive hover:bg-destructive/10"
                                : "hover:bg-slate-100"
                            }`}
                            onClick={() => {
                              setSelectedDay(day.value);
                              if (errors.day) {
                                setErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors.day;
                                  return newErrors;
                                });
                              }
                            }}
                          >
                            <span className="text-xs sm:text-sm">
                              {day.label}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Select Time</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md w-full sm:w-auto">
                          <div className="flex-1 sm:flex-none min-w-[80px]">
                            <label
                              htmlFor="hour-select"
                              className="text-xs text-muted-foreground mb-1"
                            >
                              Hour
                            </label>
                            <select
                              id="hour-select"
                              value={selectedHour}
                              onChange={(e) =>
                                setSelectedHour(Number(e.target.value))
                              }
                              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                              aria-label="Select hour"
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (hour) => (
                                  <option key={hour} value={hour}>
                                    {hour}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                          <div className="flex-1 sm:flex-none min-w-[80px]">
                            <label
                              htmlFor="period-select"
                              className="text-xs text-muted-foreground mb-1"
                            >
                              AM/PM
                            </label>
                            <select
                              id="period-select"
                              value={selectedPeriod}
                              onChange={(e) =>
                                setSelectedPeriod(e.target.value as "AM" | "PM")
                              }
                              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                              aria-label="Select AM or PM"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedDay && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-md space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Your newsletter will be sent every{" "}
                          <span className="font-medium text-foreground">
                            {
                              weekdays.find((day) => day.value === selectedDay)
                                ?.label
                            }
                          </span>{" "}
                          at{" "}
                          <span className="font-medium text-foreground">
                            {selectedHour}:00 {selectedPeriod}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          First newsletter will be sent on{" "}
                          <span className="font-medium text-foreground">
                            {(() => {
                              const now = new Date();
                              const currentDay = now.getDay();
                              const targetDay = weekdays.findIndex(
                                (day) => day.value === selectedDay
                              );
                              const daysUntilTarget =
                                (targetDay - currentDay + 7) % 7;
                              const firstDate = new Date(now);
                              firstDate.setDate(
                                now.getDate() + daysUntilTarget + 7
                              ); // Add 7 days for next week
                              firstDate.setHours(
                                selectedPeriod === "PM"
                                  ? selectedHour === 12
                                    ? 12
                                    : selectedHour + 12
                                  : selectedHour === 12
                                  ? 0
                                  : selectedHour,
                                0,
                                0,
                                0
                              );
                              return firstDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              });
                            })()}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {errors.day && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.day}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Newsletters are dispatched weekly on your selected day at
                    the specified time.
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
