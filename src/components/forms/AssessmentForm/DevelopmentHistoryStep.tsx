import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AssessmentFormValues } from "@/lib/utils/validators";


export function DevelopmentHistoryStep() {
  const form = useFormContext<AssessmentFormValues>();
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">تاريخ النمو</h3>

      <FormField
        control={form.control}
        name="walkingStartAge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>بداية المشي</FormLabel>
            <FormControl>
              <Input placeholder="مثال: 12 شهر" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sittingStartAge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>بداية الجلوس</FormLabel>
            <FormControl>
              <Input placeholder="مثال: 6 شهور" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="hasHearingProblems"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">
                هل توجد مشاكل سمعية؟
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visitedENTDoctor"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">
                هل تم عرض الطفل على طبيب أنف وأذن وحنجرة؟
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

