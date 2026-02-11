import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AssessmentFormValues } from "@/lib/utils/validators";


export function SymptomsStep() {
  const form = useFormContext<AssessmentFormValues>();
  const otherSymptoms = form.watch("otherSymptoms") || [];

  const toggleOtherSymptom = (symptom: string) => {
    if (otherSymptoms.includes(symptom)) {
      form.setValue(
        "otherSymptoms",
        otherSymptoms.filter((s: string) => s !== symptom)
      );
    } else {
      form.setValue("otherSymptoms", [...otherSymptoms, symptom]);
    }
  };
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

      {/* أعراض أخرى مخصصة */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold">أعراض أخرى</h4>

        {otherSymptoms.length > 0 && (
          <div className="space-y-2">
            {otherSymptoms.map((symptom: string) => (
              <div
                key={symptom}
                className="flex items-center gap-3 rounded-md border px-3 py-2"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={otherSymptoms.includes(symptom)}
                  onChange={() => toggleOtherSymptom(symptom)}
                />
                <span className="text-sm text-gray-800">{symptom}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Input
            placeholder="أضف عرضاً آخر (مثال: سلوك عدواني)"
            onChange={(e) =>
              // نخزن القيمة مؤقتاً في state داخل RHF باستخدام any لتجاوز القيود
              form.setValue("tempOtherSymptom" as any, e.target.value)
            }
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const raw = form.getValues("tempOtherSymptom" as any) as string | undefined;
              const trimmed = (raw || "").trim();
              if (!trimmed) return;
              if (!otherSymptoms.includes(trimmed)) {
                form.setValue("otherSymptoms", [...otherSymptoms, trimmed]);
              }
              form.setValue("tempOtherSymptom" as any, "");
            }}
          >
            إضافة أخرى
          </Button>
        </div>
      </div>
    </div>
  );
}

