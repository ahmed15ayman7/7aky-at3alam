import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AssessmentFormValues } from "@/lib/utils/validators";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";


export function TestResultsStep() {
  const form = useFormContext<AssessmentFormValues>();
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateAges = async () => {
    setIsCalculating(true);
    try {
      // جمع بيانات النموذج
      const formData = form.getValues();
      
      const response = await fetch("/api/assessment/calculate-ages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("فشل في حساب الأعمار");
      }

      const { mentalAge, languageAge } = await response.json();
      
      // تحديث القيم في النموذج
      form.setValue("mentalAge", mentalAge);
      form.setValue("languageAge", languageAge);
      
      toast.success("تم الحساب بنجاح!", {
        description: `العمر العقلي: ${mentalAge} | العمر اللغوي: ${languageAge}`,
      });
    } catch (error: any) {
      console.error("Error calculating ages:", error);
      toast.error("فشل في حساب الأعمار", {
        description: error.message || "حدث خطأ أثناء الحساب",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">نتائج الاختبارات</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={calculateAges}
          disabled={isCalculating}
          className="gap-2"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الحساب...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              حساب تلقائي
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="iqScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نسبة الذكاء</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="IQ Score"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mentalAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العمر العقلي</FormLabel>
              <FormControl>
                <Input placeholder="مثال: 5 سنوات" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languageAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العمر اللغوي</FormLabel>
              <FormControl>
                <Input placeholder="مثال: 3 سنوات" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <div>
          <FormLabel>جوانب الضعف اللغوي</FormLabel>
          <FormField
            control={form.control}
            name="weaknessAreas.linguistic"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="مثال: النطق، المفردات، التركيب اللغوي"
                    value={field.value?.join(", ")}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((v) => v.trim())
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>جوانب الضعف الأكاديمي</FormLabel>
          <FormField
            control={form.control}
            name="weaknessAreas.academic"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="مثال: القراءة، الكتابة، الحساب"
                    value={field.value?.join(", ")}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((v) => v.trim())
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>جوانب الضعف العقلي</FormLabel>
          <FormField
            control={form.control}
            name="weaknessAreas.mental"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="مثال: الانتباه، الذاكرة، التركيز"
                    value={field.value?.join(", ")}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((v) => v.trim())
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

