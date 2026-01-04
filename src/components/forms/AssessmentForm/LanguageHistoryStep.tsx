import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AssessmentFormValues } from "@/lib/utils/validators";

interface LanguageHistoryStepProps {
  form: UseFormReturn<AssessmentFormValues>;
}

export function LanguageHistoryStep({ form }: LanguageHistoryStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">التاريخ اللغوي</h3>

      <FormField
        control={form.control}
        name="firstWord"
        render={({ field }) => (
          <FormItem>
            <FormLabel>أول كلمة</FormLabel>
            <FormControl>
              <Input placeholder="أول كلمة نطقها الطفل" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="knownWords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الكلمات المعروفة</FormLabel>
            <FormControl>
              <Input placeholder="اكتب الكلمات مفصولة بفاصلة" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="spokenWords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الكلمات المنطوقة</FormLabel>
            <FormControl>
              <Input placeholder="اكتب الكلمات مفصولة بفاصلة" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sentenceStart"
        render={({ field }) => (
          <FormItem>
            <FormLabel>بداية الجملة</FormLabel>
            <FormControl>
              <Input placeholder="متى بدأ بتكوين جمل؟" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="unclearSentences"
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
            <FormLabel className="!mt-0">جملة غير مفهومة</FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
}

