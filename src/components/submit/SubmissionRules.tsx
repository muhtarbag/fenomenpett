export const SubmissionRules = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-up">
      <h2 className="text-xl font-semibold mb-4">Katılım Kuralları</h2>
      <ul className="space-y-2 text-gray-600">
        <li className="font-bold">1. Depozito gerekmiyor</li>
        <li className="font-bold">2. Fotoğraf sokak kedilerine veya köpeklerine mama/su verdiğinizi göstermeli</li>
        <li className="font-bold">3. Yüz veya çevre detayları gerekli değil</li>
        <li className="font-bold">4. Fotoğraf yüklemeden önce kullanıcı adı gerekli</li>
        <li className="font-bold">5. 500 TL bonus 48 saat içinde tanımlanacak</li>
        <li className="font-bold">6. Bonus için 5000 TL ve 1000 TL çekim işlemi gerekli</li>
        <li className="font-bold text-red-500">7. İnternetten kopyalanan fotoğraflar kabul edilmez</li>
        <li className="font-bold">8. Sokak hayvanlarına yardım ettiğiniz için teşekkürler!</li>
        <li className="font-bold text-primary">9. Yorumunuzu yazmayı unutmayın!</li>
      </ul>
    </div>
  );
};