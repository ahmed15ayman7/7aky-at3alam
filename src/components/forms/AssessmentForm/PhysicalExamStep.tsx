import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { AssessmentFormValues } from "@/lib/utils/validators";


export function PhysicalExamStep() {
  const form = useFormContext<AssessmentFormValues>();
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">الفحص العضوي للطفل</h3>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="jawDeformities"
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
              <FormLabel className="!mt-0">تشوهات في الفك</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="palateIssue"
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
              <FormLabel className="!mt-0">سقف الحلق</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tongueTie"
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
              <FormLabel className="!mt-0">رباط اللسان</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="larynxInjuries"
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
              <FormLabel className="!mt-0">إصابات بالحنجرة</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

