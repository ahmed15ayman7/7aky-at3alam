import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssessmentFormValues } from "@/lib/utils/validators";

interface MotherInfoStepProps {
  form: UseFormReturn<AssessmentFormValues>;
}

export function MotherInfoStep({ form }: MotherInfoStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">بيانات الأم والحمل</h3>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="motherAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عمر الأم</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="عمر الأم"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siblingsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عدد الأخوة</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="عدد الأخوة"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birthType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>نوع الولادة</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الولادة" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="طبيعي">طبيعي</SelectItem>
                <SelectItem value="قيصري">قيصري</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="hadIncidentsDuringPregnancy"
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
                هل حدثت الأم لحادث أو سقطت؟
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasSimilarCaseInFamily"
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
                هل توجد حالة مشابهة في الأسرة؟
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hadOxygenDeficiency"
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
                هل تعرض الطفل لنقص الأكسجين؟
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

