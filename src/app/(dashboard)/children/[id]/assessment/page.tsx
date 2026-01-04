import { AssessmentForm } from "@/components/forms/AssessmentForm";

export default function ChildAssessmentPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">استمارة التقييم</h1>
        <p className="text-gray-600 mt-2">قم بتعبئة استمارة التقييم للطفل</p>
      </div>

      <AssessmentForm childId={params.id} />
    </div>
  );
}

