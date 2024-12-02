export const SubmissionRules = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-up">
      <h2 className="text-xl font-semibold mb-4">Katılım Kuralları</h2>
      <div className="space-y-4 text-gray-600">
        <div>
          <p className="font-semibold">1. Depozito Gerekmiyor</p>
          <p>İlk katılım için herhangi bir yatırım şartı aranmamaktadır.</p>
        </div>

        <div>
          <p className="font-semibold">2. Fotoğraf Gönderimi</p>
          <p>Sokak kedilerine veya köpeklerine mama/su verdiğinizi gösteren bir fotoğraf yüklenmelidir zorunludur.</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Fotoğrafta yüzünüzün veya çevre detaylarının görünmesi gerekmez.</li>
            <li>İnternetten alınan fotoğraflar kabul edilmez.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">3. Kullanıcı</p>
          <p>Fotoğraf yüklemeden önce kullanıcı adınızı belirtmeniz zorunludur.</p>
        </div>

        <div>
          <p className="font-semibold">4. Yorum</p>
          <p>Gönderinizle birlikte kısa bir yorum eklemeyi unutmayın.</p>
        </div>

        <div>
          <p className="font-semibold">5. Bonus Tanımlama</p>
          <p>Katılım sonrası 500 TL bonus, hesabınıza 48 saat içinde tanımlanacaktır.</p>
        </div>

        <div>
          <p className="font-semibold">6. Bonus Kullanımı</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Bonusu çekebilmek için, toplam bakiyenizi 5000 TL'ye ulaştırmanız gerekmektedir.</li>
            <li>5000 TL bakiyeye ulaştıktan sonra 1000 TL çekim işlemi yapabilirsiniz.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">7. Katılım Sıklığı</p>
          <p>Her üye bu kampanyadan 30 günde 1 kez faydalanabilir.</p>
        </div>

        <div>
          <p className="font-semibold">8. Yatırım Şartı</p>
          <ul className="list-disc ml-6 mt-2">
            <li>İlk katılımda yatırım şartı aranmamaktadır.</li>
            <li>Sonraki katılımlarda, iki bonus arasında en az 250 TL yatırım yapılması gereklidir.</li>
            <li>Kampanya her katılım arası 30 gün ile sınırlıdır.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">9. Teşekkür</p>
          <p>Patili dostlarımıza yardım ettiğiniz için teşekkür ederiz!</p>
        </div>

        <p className="mt-6 text-sm italic">
          Bu kurallar kapsamında kampanyaya katılabilir ve sokak hayvanlarına destek olabilirsiniz!
        </p>
      </div>
    </div>
  );
};