import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AssessmentFormValues } from "@/lib/utils/validators";

interface TestResultsStepProps {
  form: UseFormReturn<AssessmentFormValues>;
}

export function TestResultsStep({ form }: TestResultsStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">نتائج الاختبارات</h3>

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

      <FormField
        control={form.control}
        name="chiefComplaint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الشكوى الرئيسية</FormLabel>
            <FormControl>
              <Textarea
                placeholder="اكتب الشكوى الرئيسية للحالة..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

