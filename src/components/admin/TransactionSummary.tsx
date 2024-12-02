interface TransactionSummaryProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const TransactionSummary = ({
  pendingCount,
  approvedCount,
  rejectedCount
}: TransactionSummaryProps) => {
  const totalTransactions = pendingCount + approvedCount + rejectedCount;

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">İşlem Özeti</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Toplam Gönderi</p>
          <p className="text-2xl font-bold">{totalTransactions}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-600">Bekleyen</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600">Onaylanan</p>
          <p className="text-2xl font-bold">{approvedCount}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">Reddedilen</p>
          <p className="text-2xl font-bold">{rejectedCount}</p>
        </div>
      </div>
    </div>
  );
};