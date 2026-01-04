import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AssessmentFormValues } from "@/lib/utils/validators";

interface ReceptiveLanguageStepProps {
  form: UseFormReturn<AssessmentFormValues>;
}

export function ReceptiveLanguageStep({ form }: ReceptiveLanguageStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">اللغة الاستقبالية</h3>
      <p className="text-sm text-gray-600">
        اكتب العناصر التي يعرفها الطفل، مفصولة بفاصلة
      </p>

      <FormField
        control={form.control}
        name="receptiveLanguage.bodyParts"
        render={({ field }) => (
          <FormItem>
            <FormLabel>أجزاء الجسم</FormLabel>
            <FormControl>
              <Input
                placeholder="مثال: عين، أنف، فم"
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

      <FormField
        control={form.control}
        name="receptiveLanguage.animals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الحيوانات</FormLabel>
            <FormControl>
              <Input
                placeholder="مثال: قطة، كلب، أسد"
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

      <FormField
        control={form.control}
        name="receptiveLanguage.vegetables"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الخضروات</FormLabel>
            <FormControl>
              <Input
                placeholder="مثال: طماطم، خيار، جزر"
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

      <FormField
        control={form.control}
        name="receptiveLanguage.furniture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الأثاث</FormLabel>
            <FormControl>
              <Input
                placeholder="مثال: كرسي، طاولة، سرير"
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

      <FormField
        control={form.control}
        name="receptiveLanguage.tools"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الأدوات</FormLabel>
            <FormControl>
              <Input
                placeholder="مثال: ملعقة، شوكة، سكين"
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

      <FormField
        control={form.control}
        name="receptiveLanguage.colors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الألوان</FormLabel>
            <FormControl>
              <Input
                placeholder="مثال: أحمر، أزرق، أخضر"
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
  );
}

