export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="eyebrow">Loading</p>
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          読み込み中です。初回は10秒ほどかかることがあります。
        </p>
      </div>
    </div>
  );
}
