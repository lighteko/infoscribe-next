"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  QuestionMarkCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { createProvider } from "@/lib/api/requests/provider.requests";
import { calculateFirstDispatchDate, weekday2Cron } from "@/lib/utils";
import { sendGAEvent } from "@/lib/analytics";

const weekdays = [
  { value: "SUN", label: "Sunday" },
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
];

export default function CreateProviderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (
      trimmedTag &&
      tags.length < 2 &&
      !tags.includes(trimmedTag) &&
      trimmedTag.length <= 15
    ) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only update if the input is <= 15 characters
    if (e.target.value.length <= 15) {
      setTagInput(e.target.value);
    }
  };

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

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required";
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
        title: formData.name,
        summary: formData.description,
        tags,
        locale: "En-US",
        schedule: weekday2Cron(selectedDay, hour24),
      };

      await createProvider(providerData);

      // Send create_provider event
      sendGAEvent("create_provider", {
        provider_title: providerData.title,
        tags: providerData.tags.join(","), // Send tags as comma-separated string
        schedule: providerData.schedule,
      });

      toast({
        title: "Success",
        description: "Provider created successfully!",
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Provider
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold">Provider Details</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the details for your new newsletter provider.
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
                    <span className="text-sm text-muted-foreground">
                      {tags.length}/2 added
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs py-0.5 pl-2 pr-1 flex items-center gap-1 h-7 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                      >
                        {tag}
                        <XMarkIcon
                          className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors"
                          onClick={() => handleRemoveTag(tag)}
                          title={`Remove ${tag} tag`}
                          aria-label={`Remove ${tag} tag`}
                        />
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={tagInput}
                        onChange={handleTagInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a keyword tag..."
                        disabled={tags.length >= 2}
                        className={`h-9 pr-14 ${
                          errors.tags ? "border-destructive" : ""
                        }`}
                        maxLength={15}
                      />
                      {tagInput && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {tagInput.length}/15
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={handleAddTag}
                      disabled={
                        tags.length >= 2 ||
                        !tagInput.trim() ||
                        tagInput.length > 15
                      }
                      type="button"
                      size="sm"
                      className="h-9 px-3"
                    >
                      <PlusIcon className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
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
                            {calculateFirstDispatchDate(
                              weekdays,
                              selectedDay,
                              selectedHour,
                              selectedPeriod
                            )}
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Provider"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
