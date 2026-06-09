// -------------------- Модалка --------------------
function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

function openModalFromData(title, origin, altitude, process, notes, desc, extra) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = desc;
    document.getElementById('modalTech').innerHTML = `
        <div class="tech-item"><span class="tech-label">🌍 Происхождение</span><span class="tech-value">${origin}</span></div>
        <div class="tech-item"><span class="tech-label">⛰ Высота</span><span class="tech-value">${altitude}</span></div>
        <div class="tech-item"><span class="tech-label">⚙️ Обработка</span><span class="tech-value">${process}</span></div>
        <div class="tech-item"><span class="tech-label">🍇 Ноты вкуса</span><span class="tech-value">${notes}</span></div>
    `;
    updateAccordionContent(extra);
    modal.style.display = 'flex';
}

// -------------------- Аккордеон --------------------
let accordionOpen = false;
const accordionBtn = document.getElementById('accordionBtn');
const accordionContent = document.getElementById('accordionContent');

function updateAccordionContent(extra) {
    const ingredientsBlock = document.getElementById('ingredientsBlock');
    if (extra && extra.ingredients && extra.ingredients.length) {
        let html = `<h4 style="margin-bottom:10px;">🍽 Состав:</h4><ul class="ingredients-list">`;
        extra.ingredients.forEach(ing => { html += `<li>${ing}</li>`; });
        html += `</ul>`;
        if (extra.allergens) html += `<p><strong>⚠️ Аллергены:</strong> ${extra.allergens}</p>`;
        if (extra.calories) html += `<div class="nutrition-grid"><div><strong>🔥 Калории</strong><br>${extra.calories}</div></div>`;
        ingredientsBlock.innerHTML = html;
    } else {
        ingredientsBlock.innerHTML = '<p>Детальная информация отсутствует.</p>';
    }
    // Сбрасываем в закрытое состояние
    if (accordionContent) {
        accordionContent.style.maxHeight = '0';
        accordionContent.classList.remove('show');
        if (accordionBtn) accordionBtn.querySelector('.accordion-icon').innerHTML = '▼';
        accordionOpen = false;
    }
}

if (accordionBtn && accordionContent) {
    accordionBtn.addEventListener('click', () => {
        if (accordionOpen) {
            accordionContent.style.maxHeight = '0';
            accordionContent.classList.remove('show');
            accordionBtn.querySelector('.accordion-icon').innerHTML = '▼';
        } else {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            accordionContent.classList.add('show');
            accordionBtn.querySelector('.accordion-icon').innerHTML = '▲';
        }
        accordionOpen = !accordionOpen;
    });
}

// Закрытие по клику вне окна и Escape
window.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (modal && e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// -------------------- Интерактивный гид --------------------
function initGuide() {
    const guideOptions = document.querySelectorAll('.guide-opt');
    const resultBox = document.querySelector('.result-box');
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');
    if (!guideOptions.length || !resultBox) return;
    guideOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const title = opt.getAttribute('data-title');
            const text = opt.getAttribute('data-text');
            if (title && text && resultTitle && resultText) {
                resultTitle.innerText = title;
                resultText.innerText = text;
                resultBox.style.display = 'block';
            }
        });
    });
}

// -------------------- Слайдер меню --------------------
function initMenuSlider() {
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    if (!track || slides.length === 0) return;

    let currentIndex = 0, intervalId = null;
    const total = slides.length;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            if (idx === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function goToSlide(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        resetAutoSlide();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    function startAutoSlide() { if (intervalId) clearInterval(intervalId); intervalId = setInterval(() => nextSlide(), 5000); }
    function resetAutoSlide() { if (intervalId) clearInterval(intervalId); startAutoSlide(); }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    startAutoSlide();

    const slider = document.querySelector('.menu-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => { if (intervalId) clearInterval(intervalId); intervalId = null; });
        slider.addEventListener('mouseleave', startAutoSlide);
    }
}

// -------------------- Анимация при скролле --------------------
function initScrollAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    elements.forEach(el => observer.observe(el));
}

// -------------------- (coffeeCards) --------------------
const coffeeCards = {
    "Лавандовый Латте": { origin: "Эфиопия, Сидамо", altitude: "2,200 м", process: "Мытая", notes: "Жасмин, Бергамот, Лаванда", desc: "Фирменный эспрессо с воздушной молочной пеной и легким шлейфом лаванды.", ingredients: ["Эспрессо (двойной)", "Молоко 3,5%", "Сироп лаванды", "Сушёные цветки лаванды"], allergens: ["Молоко"], calories: "210 ккал" },
    "Карамельный Раф": { origin: "Колумбия, Уила", altitude: "1,800 м", process: "Хани", notes: "Ириска, Красное яблоко, Какао", desc: "Нежнейшие сливки, взбитые с эспрессо и домашней соленой карамелью.", ingredients: ["Эспрессо", "Сливки 33%", "Сироп солёная карамель", "Соль"], allergens: ["Молоко"], calories: "380 ккал" },
    "Эспрессо (двойной)": { origin: "Бразилия+Эфиопия", altitude: "1,100 м", process: "Натуральная", notes: "Шоколад, орехи, цитрус", desc: "Насыщенный, с плотной пенкой крема.", ingredients: ["Кофе арабика", "Вода"], allergens: ["Нет"], calories: "5 ккал" },
    "Американо": { origin: "Микс арабики", altitude: "1,200–1,800 м", process: "Мытая", notes: "Мягкий, карамель", desc: "Классический эспрессо, разбавленный горячей водой.", ingredients: ["Эспрессо", "Горячая вода"], allergens: ["Нет"], calories: "5 ккал" },
    "Капучино": { origin: "Бразилия Серрадо", altitude: "1,100 м", process: "Натуральный", notes: "Орехи, молочный шоколад", desc: "Эспрессо, равные доли молока и плотной молочной пены.", ingredients: ["Эспрессо", "Молоко", "Молочная пена"], allergens: ["Молоко"], calories: "140 ккал" },
    "Флэт Уайт": { origin: "Колумбия", altitude: "1,700 м", process: "Мытая", notes: "Карамель, красные ягоды", desc: "Двойной эспрессо с тонким слоем микропены.", ingredients: ["Двойной эспрессо", "Микропена из молока"], allergens: ["Молоко"], calories: "120 ккал" },
    "Медовый Раф с корицей": { origin: "Перу", altitude: "1,650 м", process: "Мытая", notes: "Мед, корица, топленое молоко", desc: "Натуральный мед, корица, эспрессо и топленое молоко.", ingredients: ["Эспрессо", "Топленое молоко", "Мед", "Корица"], allergens: ["Молоко"], calories: "320 ккал" },
    "Мокко": { origin: "Эквадор", altitude: "1,500 м", process: "Мытая", notes: "Апельсин, темный шоколад", desc: "Шоколадный латте с добавлением эспрессо и взбитых сливок.", ingredients: ["Эспрессо", "Горячий шоколад", "Взбитые сливки"], allergens: ["Молоко", "Какао"], calories: "380 ккал" },
    "Ирландский кофе": { origin: "Ирландия", altitude: "—", process: "Кофе+виски", notes: "Виски, коричневый сахар, сливки", desc: "Горячий кофе с ирландским виски и шапкой сливок.", ingredients: ["Эспрессо", "Ирландский виски", "Коричневый сахар", "Взбитые сливки"], allergens: ["Алкоголь", "Молоко"], calories: "420 ккал" },
    "Эспрессо Романо": { origin: "Италия", altitude: "—", process: "Эспрессо с лимоном", notes: "Лимон, цитрус", desc: "Классический эспрессо с долькой лимона.", ingredients: ["Эспрессо", "Лимон"], allergens: ["Нет"], calories: "5 ккал" },
    "Латте Макиато": { origin: "Италия", altitude: "—", process: "Слоевая заливка", notes: "Молоко, пенка, эспрессо", desc: "Горячее молоко, затем эспрессо — красивое пятно.", ingredients: ["Горячее молоко", "Молочная пена", "Эспрессо"], allergens: ["Молоко"], calories: "180 ккал" },
    "Бомбон (кофе по-вьетнамски)": { origin: "Вьетнам", altitude: "—", process: "На сгущенке", notes: "Сгущенное молоко, робуста", desc: "Эспрессо на сгущенном молоке со льдом.", ingredients: ["Сгущенное молоко", "Эспрессо", "Лед"], allergens: ["Молоко"], calories: "250 ккал" },
    "Матча Латте Церемониал": { origin: "Удзи, Киото", altitude: "—", process: "Теневое выращивание", notes: "Сливки, трава, умами", desc: "Насыщенный зеленый чай, приготовленный традиционным бамбуковым венчиком.", ingredients: ["Порошок матча", "Кокосовое молоко", "Вода"], allergens: ["Нет"], calories: "180 ккал" },
    "Пряный Какао": { origin: "Бельгия, 70% какао", altitude: "—", process: "Обжарка", notes: "Корица, мускат, зефир", desc: "Натуральный бельгийский шоколад с добавлением ароматной корицы.", ingredients: ["Какао-порошок", "Молоко", "Корица", "Мускатный орех", "Маршмеллоу"], allergens: ["Молоко"], calories: "310 ккал" },
    "Чай Масала": { origin: "Индия", altitude: "—", process: "Ферментация", notes: "Кардамон, корица, имбирь", desc: "Черный чай с молоком, кардамоном, корицей, имбирем и гвоздикой.", ingredients: ["Черный чай", "Молоко", "Кардамон", "Корица", "Имбирь", "Гвоздика"], allergens: ["Молоко"], calories: "120 ккал" },
    "Глинтвейн (безалкогольный)": { origin: "Европа", altitude: "—", process: "Томление", notes: "Апельсин, корица, бадьян", desc: "Согревающий напиток на виноградном соке.", ingredients: ["Виноградный сок", "Апельсин", "Корица", "Бадьян", "Мед"], allergens: ["Нет"], calories: "200 ккал" },
    "Травяной сбор «Вечерний»": { origin: "Алтай", altitude: "—", process: "Сушка", notes: "Ромашка, мелисса, чабрец", desc: "Успокаивающий травяной чай.", ingredients: ["Ромашка", "Мелисса", "Чабрец", "Мята"], allergens: ["Нет"], calories: "5 ккал" },
    "Куркума латте": { origin: "Индия", altitude: "—", process: "Смешивание", notes: "Куркума, имбирь, перец", desc: "Золотое молоко с куркумой, имбирем и щепоткой черного перца.", ingredients: ["Кокосовое молоко", "Куркума", "Имбирь", "Черный перец", "Мед"], allergens: ["Нет"], calories: "190 ккал" },
    "Чай с бергамотом (Эрл Грей)": { origin: "Китай", altitude: "—", process: "Ароматизация", notes: "Бергамот, цитрус", desc: "Классический черный чай с маслом бергамота.", ingredients: ["Черный чай", "Масло бергамота"], allergens: ["Нет"], calories: "5 ккал" },
    "Ягодный морс с мятой": { origin: "Россия", altitude: "—", process: "Настаивание", notes: "Брусника, клюква, мята", desc: "Освежающий напиток из брусники, клюквы и свежей мяты.", ingredients: ["Брусника", "Клюква", "Мята", "Сахар"], allergens: ["Нет"], calories: "110 ккал" },
    "Имбирный чай с медом": { origin: "Азия", altitude: "—", process: "Настой", notes: "Имбирь, лимон, мед", desc: "Согревающий настой из свежего имбиря, лимона и акациевого меда.", ingredients: ["Имбирь", "Лимон", "Мед", "Вода"], allergens: ["Нет"], calories: "70 ккал" },
    "Мятный шоколад": { origin: "Европа", altitude: "—", process: "Растворение", notes: "Мята, шоколад, сливки", desc: "Горячий шоколад с мятой и взбитыми сливками.", ingredients: ["Темный шоколад", "Молоко", "Мята", "Взбитые сливки"], allergens: ["Молоко"], calories: "400 ккал" },
    "Каркадэ (Хамайрик)": { origin: "Судан", altitude: "—", process: "Сушка", notes: "Гибискус, клюква", desc: "Красный чай из суданской розы, богат витамином С.", ingredients: ["Цветки гибискуса", "Вода", "Сахар"], allergens: ["Нет"], calories: "30 ккал" },
    "Бурый рис чай (Гэнмайтя)": { origin: "Япония", altitude: "—", process: "Обжаривание", notes: "Зеленый чай, рис, орех", desc: "Зеленый чай с обжаренным рисом — нежный ореховый аромат.", ingredients: ["Зеленый чай", "Обжаренный рис"], allergens: ["Нет"], calories: "5 ккал" },
    "Миндальный Круассан": { origin: "Франция", altitude: "—", process: "Ферментация", notes: "Масло, миндаль, хруст", desc: "Свежая выпечка из слоеного теста с богатым наполнением миндального крема.", ingredients: ["Пшеничная мука", "Сливочное масло", "Миндальная мука", "Сахар", "Яйцо", "Миндальные лепестки"], allergens: ["Глютен", "Яйца", "Орехи"], calories: "450 ккал" },
    "Скрембл-тост с лососем": { origin: "Скандинавия", altitude: "—", process: "Ручной замес", notes: "Сыр, укроп, лосось", desc: "Хрустящий крафтовый хлеб, воздушный скрембл и слабосоленая форель.", ingredients: ["Крафтовый хлеб", "Яйца", "Сливки", "Слабосоленый лосось", "Укроп"], allergens: ["Глютен", "Яйца", "Рыба"], calories: "520 ккал" },
    "Гранола с йогуртом и ягодами": { origin: "Домашняя кухня", altitude: "—", process: "Запекание", notes: "Мед, орехи, ягоды", desc: "Хрустящая гранола с греческим йогуртом, свежими ягодами и медом.", ingredients: ["Овсяные хлопья", "Мед", "Орехи", "Греческий йогурт", "Ягоды"], allergens: ["Молоко", "Орехи"], calories: "390 ккал" },
    "Сэндвич с курицей и песто": { origin: "Италия", altitude: "—", process: "Сборка", notes: "Песто, курица, руккола", desc: "Фокачча с куриным филе, соусом песто, рукколой и вялеными томатами.", ingredients: ["Фокачча", "Куриное филе", "Соус песто", "Руккола", "Вяленые томаты"], allergens: ["Глютен", "Орехи (песто)"], calories: "480 ккал" },
    "Авокадо-тост с яйцом пашот": { origin: "Современная", altitude: "—", process: "Пашот", notes: "Авокадо, лимон, паприка", desc: "Зерновой хлеб, пюре из авокадо, яйцо пашот, микрозелень.", ingredients: ["Зерновой хлеб", "Авокадо", "Лимонный сок", "Яйцо пашот", "Микрозелень"], allergens: ["Глютен", "Яйца"], calories: "430 ккал" },
    "Шоколадный брауни": { origin: "Бельгия", altitude: "—", process: "Двойная варка", notes: "Орехи, темный шоколад", desc: "Плотный влажный брауни с грецким орехом и шариком пломбира.", ingredients: ["Темный шоколад", "Сливочное масло", "Сахар", "Яйца", "Мука", "Грецкий орех"], allergens: ["Глютен", "Яйца"], calories: "480 ккал" },
    "Оладьи с бананом": { origin: "Америка", altitude: "—", process: "Жарка", notes: "Банан, кленовый сироп", desc: "Воздушные оладьи, карамелизированный банан, кленовый сироп.", ingredients: ["Мука", "Молоко", "Яйцо", "Банан", "Кленовый сироп", "Сливочное масло"], allergens: ["Глютен", "Яйца", "Молоко"], calories: "520 ккал" },
    "Панкейки с кленовым сиропом": { origin: "США", altitude: "—", process: "Жарка", notes: "Масло, сироп", desc: "Три американских панкейка, кленовый сироп, сливочное масло.", ingredients: ["Мука", "Молоко", "Яйца", "Разрыхлитель", "Кленовый сироп", "Масло"], allergens: ["Глютен", "Яйца", "Молоко"], calories: "550 ккал" },
    "Киш с лососем и шпинатом": { origin: "Франция", altitude: "—", process: "Запекание", notes: "Лосось, шпинат, сливки", desc: "Песочная основа, заливка из сливок и яиц, слабосоленый лосось и шпинат.", ingredients: ["Песочное тесто", "Яйца", "Сливки", "Лосось", "Шпинат", "Сыр"], allergens: ["Глютен", "Яйца", "Молоко", "Рыба"], calories: "620 ккал" },
    "Капрезе сэндвич": { origin: "Италия", altitude: "—", process: "Сборка", notes: "Моцарелла, томаты, базилик", desc: "Чиабатта, моцарелла, томаты, базилик, бальзамический соус.", ingredients: ["Чиабатта", "Моцарелла", "Помидоры", "Базилик", "Бальзамический соус"], allergens: ["Глютен", "Молоко"], calories: "490 ккал" },
    "Тарт Татен": { origin: "Франция", altitude: "—", process: "Карамелизация", notes: "Яблоки, карамель", desc: "Перевернутый яблочный пирог с карамельной корочкой.", ingredients: ["Слоеное тесто", "Яблоки", "Сахар", "Сливочное масло"], allergens: ["Глютен", "Молоко"], calories: "380 ккал" },
    "Овсяноблин с творогом": { origin: "Россия", altitude: "—", process: "Жарка", notes: "Овсяная мука, творог, ягоды", desc: "Овсяный блинчик, творожная начинка, свежие ягоды и мед.", ingredients: ["Овсяная мука", "Молоко", "Яйцо", "Творог", "Ягоды", "Мед"], allergens: ["Глютен", "Яйца", "Молоко"], calories: "410 ккал" }
};

// -------------------- Инициализация обработчиков карточек меню --------------------
function initMenuCards() {
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = card.getAttribute('data-name');
            const data = coffeeCards[name];
            if (data) {
                openModalFromData(name, data.origin, data.altitude, data.process, data.notes, data.desc, {
                    ingredients: data.ingredients,
                    allergens: data.allergens,
                    calories: data.calories
                });
            }
        });
    });
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
}

// -------------------- Квиз для подбора кофе (для guide.html) --------------------
function initQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;

    // Если структура уже есть в HTML, используем её, иначе создаём
    if (!document.querySelector('.quiz-steps')) return; // предполагаем, что разметка уже есть

    let answers = JSON.parse(sessionStorage.getItem('coffeeQuizAnswers')) || {};
    let currentStep = 0;
    const steps = ['effect', 'milk', 'sweetness', 'aroma'];
    const stepTitles = [
        'Какой эффект вы хотите получить?',
        'Как вы относитесь к молоку?',
        'Любите сладость?',
        'Какой аромат вам ближе?'
    ];

    // Словари для отображения выбранных значений (необязательно)
    function renderStep(stepIndex) {
        const stepDiv = document.getElementById(`step-${stepIndex}`);
        if (!stepDiv) return;
        document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active-step'));
        stepDiv.classList.add('active-step');
        document.querySelector('.quiz-question').innerText = stepTitles[stepIndex];

        // Обновляем прогресс
        document.querySelectorAll('.progress-step').forEach((el, idx) => {
            el.classList.remove('active', 'completed');
            if (idx === stepIndex) el.classList.add('active');
            else if (answers[steps[idx]]) el.classList.add('completed');
        });

        // Управление видимостью кнопки "Назад"
        const prevBtn = stepDiv.querySelector('.quiz-prev');
        if (prevBtn) prevBtn.style.visibility = stepIndex === 0 ? 'hidden' : 'visible';
    }

    function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;
        currentStep = stepIndex;
        renderStep(currentStep);
    }

    function getRecommendation() {
        if (answers.effect === 'energize' && answers.sweetness === 'bitter') {
            return {
                name: 'Эспрессо (двойной)',
                price: '180 ₽',
                desc: 'Мощный заряд бодрости и насыщенный вкус.',
                img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=85',
                link: 'menu.html#coffee'
            };
        }
        if (answers.effect === 'relax' && answers.milk !== 'no' && answers.aroma === 'floral') {
            return {
                name: 'Лавандовый Латте',
                price: '320 ₽',
                desc: 'Нежный цветочный аромат и уютная пенка.',
                img: 'https://avatars.mds.yandex.net/i?id=936dd4d5e008e6501ad5bef89828bdb8_l-3738095-images-thumbs&n=13',
                link: 'menu.html#coffee'
            };
        }
        if (answers.milk === 'plant' && answers.sweetness === 'sweet') {
            return {
                name: 'Матча Латте на кокосовом молоке',
                price: '340 ₽',
                desc: 'Кремовая текстура, ноты умами и лёгкая сладость.',
                img: 'https://www.vitalproteins.com/cdn/shop/articles/AdobeStock_91649245-copy_600x.jpg?v=1595975471',
                link: 'menu.html#tea'
            };
        }
        return {
            name: 'Классический Капучино',
            price: '260 ₽',
            desc: 'Сбалансированный вкус, мягкая пена.',
            img: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=300&q=85',
            link: 'menu.html#coffee'
        };
    }

    function showResult() {
        document.querySelector('.quiz-steps').style.display = 'none';
        document.querySelector('.quiz-result').style.display = 'block';
        const rec = getRecommendation();
        const resultDiv = document.querySelector('.quiz-result');
        resultDiv.innerHTML = `
            <h3 class="quiz-question" style="font-size:1.8rem;">Ваша идеальная чашка ☕️</h3>
            <div class="recommend-card">
                <img src="${rec.img}" class="recommend-img" alt="${rec.name}">
                <div class="recommend-info">
                    <div class="recommend-name">${rec.name}</div>
                    <div class="recommend-price">${rec.price}</div>
                    <p class="recommend-desc">${rec.desc}</p>
                    <a href="${rec.link}" class="recommend-btn">Перейти в меню</a>
                </div>
            </div>
            <button class="reset-quiz">Пройти заново</button>
        `;
        resultDiv.querySelector('.reset-quiz').addEventListener('click', () => {
            sessionStorage.removeItem('coffeeQuizAnswers');
            answers = {};
            currentStep = 0;
            document.querySelector('.quiz-steps').style.display = 'block';
            document.querySelector('.quiz-result').style.display = 'none';
            renderStep(0);
        });
    }

    // Обработчики для опций
    document.querySelectorAll('.quiz-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            const step = parseInt(opt.dataset.step);
            const value = opt.dataset.value;
            answers[steps[step]] = value;
            sessionStorage.setItem('coffeeQuizAnswers', JSON.stringify(answers));
            // Визуальное выделение
            document.querySelectorAll(`#step-${step} .quiz-opt`).forEach(el => el.classList.remove('selected'));
            opt.classList.add('selected');
            if (step + 1 < steps.length) {
                goToStep(step + 1);
            } else {
                showResult();
            }
        });
    });

    // Обработчики кнопок "Назад"
    document.querySelectorAll('.quiz-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) goToStep(currentStep - 1);
        });
    });

    // Восстановление сохранённых ответов
    if (Object.keys(answers).length) {
        let lastStep = 0;
        for (let i = 0; i < steps.length; i++) {
            if (!answers[steps[i]]) break;
            lastStep = i;
        }
        currentStep = lastStep;
        if (lastStep === steps.length - 1 && answers[steps[lastStep]]) {
            showResult();
        } else {
            renderStep(currentStep);
            document.querySelector('.quiz-steps').style.display = 'block';
            document.querySelector('.quiz-result').style.display = 'none';
        }
    } else {
        renderStep(0);
    }
}

// -------------------- Совет бариста --------------------
function initBaristaTip() {
    const tipContainer = document.querySelector('.barista-tip');
    if (!tipContainer) return;

    const tips = [
        { text: "Для более насыщенного вкуса эспрессо используйте предварительно прогретую чашку.", author: "Анна, шеф-бариста" },
        { text: "Хотите нежный раф? Добавьте щепотку соли – она подчеркнёт сладость карамели.", author: "Марк, мастер латте-арта" },
        { text: "Лучше всего хранить кофе в вакуумном контейнере при комнатной температуре. Холодильник убивает аромат!", author: "Анна, шеф-бариста" },
        { text: "Попробуйте наш Лавандовый Латте с овсяным молоком – цветочные ноты раскрываются ярче.", author: "Бариста рекомендует" },
        { text: "Для домашнего пуровера используйте воду 92-94°C и круговую заливку – так вкус будет ровным.", author: "Кофейный гид" },
        { text: "Не бойтесь экспериментировать с растительным молоком: миндальное добавит ореховых нот, кокосовое – тропической сладости.", author: "Елена, кондитер" }
    ];

    function updateTip() {
        const random = tips[Math.floor(Math.random() * tips.length)];
        const tipText = tipContainer.querySelector('.barista-text p');
        if (tipText) tipText.innerHTML = `«${random.text}»<br><small style="opacity:0.7;">— ${random.author}</small>`;
    }

    updateTip();
    const refreshBtn = tipContainer.querySelector('.refresh-tip');
    if (refreshBtn) refreshBtn.addEventListener('click', updateTip);
}
// -------------------- Глоссарий --------------------
function initGlossary() {
    const glossaryItems = document.querySelectorAll('.glossary-item');
    if (!glossaryItems.length) return;
    glossaryItems.forEach(item => {
        const term = item.querySelector('.glossary-term');
        term.addEventListener('click', (e) => {
            e.stopPropagation();
            item.classList.toggle('open');
        });
    });
}
// -------------------- Запуск всех инициализаций --------------------
document.addEventListener('DOMContentLoaded', () => {
    initGuide();            // гид с карточками настроения (на главной и guide.html, если есть)
    initMenuSlider();       // слайдер на странице меню
    initScrollAnimation();  // анимация появления при скролле
    initMenuCards();        // обработчики кликов по карточкам меню
    initQuiz();             // квиз на странице guide.html (если есть)
    initBaristaTip();       // совет бариста на guide.html
     initGlossary();
});