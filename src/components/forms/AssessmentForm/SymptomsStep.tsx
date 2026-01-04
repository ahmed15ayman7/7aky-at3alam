import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { AssessmentFormValues } from "@/lib/utils/validators";

interface SymptomsStepProps {
  form: UseFormReturn<AssessmentFormValues>;
}

export function SymptomsStep({ form }: SymptomsStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">أعراض مصاحبة وسلوكيات مرضية</h3>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bedwetting"
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
              <FormLabel className="!mt-0">تبول لا إرادي</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anxiety"
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
              <FormLabel className="!mt-0">قلق</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hyperactivity"
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
              <FormLabel className="!mt-0">نشاط زائد</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fear"
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
              <FormLabel className="!mt-0">خوف</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shyness"
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
              <FormLabel className="!mt-0">خجل</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distracted"
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
              <FormLabel className="!mt-0">تشتت</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urinaryIncontinence"
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
              <FormLabel className="!mt-0">أخذ الطعام لا إرادي</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

