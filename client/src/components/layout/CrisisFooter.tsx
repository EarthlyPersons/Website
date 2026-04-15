export default function CrisisFooter() {
  return (
    <div className="bg-sage/20 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h3 className="font-semibold mb-2">If you're in crisis</h3>
          <p className="text-sm mb-4">Please reach out for immediate support:</p>
          <div className="space-y-2">
            <p><a href="tel:116123" className="text-emerald hover:underline">Samaritans: 116 123</a></p>
            <p><a href="tel:999" className="text-emerald hover:underline">Emergency: 999</a></p>
            <p><a href="tel:111" className="text-emerald hover:underline">NHS: 111</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}