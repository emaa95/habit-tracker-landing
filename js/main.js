class HabitTracker {
    constructor() {
        this.habits = this.loadHabits()
        this.selectedEmoji = "🎯"
        this.inspirationalQuotes = [
            "Los pequeños pasos diarios crean grandes cambios 🌟",
            "Cada día es una nueva oportunidad para crecer 🌱",
            "La constancia es la clave del éxito 🔑",
            "Tus hábitos definen tu futuro ✨",
            "El progreso, no la perfección 🎯",
        ]

        this.benefits = [
            "🌟 Más energía y motivación",
            "🧠 Mayor concentración y claridad mental",
            "❤️ Mejora la salud física y emocional",
            "⏱️ Mejor gestión del tiempo",
            "📚 Aprendizaje constante",
            "💪 Disciplina y resiliencia"
        ]

        this.init()
    }

    init() {
        this.bindEvents()
        this.render()
        this.updateRandomQuote()
        this.renderBenefitsCarousel()

        setTimeout(() => {
            this.startCarouselAnimation()
        }, 100)

    }

    renderBenefitsCarousel() {
        const track = document.getElementById("benefits-track")
        if (!track) return

        track.innerHTML = this.benefits.map(benefit =>
            `<div class="carousel-item">${benefit}</div>`
        ).join("")
    }
    startCarouselAnimation() {
        const track = document.getElementById("benefits-track")
        if (!track) return

        const firstItem = track.firstElementChild
        if (!firstItem) return 
        const move = () => {
            const firstItem = track.firstElementChild
            if (!firstItem) return

            const itemWidth = firstItem.offsetWidth + 32 

            track.style.transition = "transform 0.6s linear"
            track.style.transform = `translateX(-${itemWidth}px)`

            track.addEventListener("transitionend", () => {
                track.style.transition = "none"
                track.appendChild(firstItem) 
                track.style.transform = "translateX(0)"
                setTimeout(move, 2000) 
            }, { once: true })
        }

        setTimeout(move, 2000)
    }


    bindEvents() {

        document.getElementById("create-habit-btn").addEventListener("click", () => {
            this.showForm()
        })

        document.getElementById("add-habit-empty-btn").addEventListener("click", () => {
            this.showForm()
        })

        document.getElementById("close-form-btn").addEventListener("click", () => {
            this.hideForm()
        })

        document.getElementById("cancel-form-btn").addEventListener("click", () => {
            this.hideForm()
        })

        document.getElementById("habit-form").addEventListener("submit", (e) => {
            this.handleFormSubmit(e)
        })

        document.querySelectorAll(".emoji-btn").forEach(
            (btn) => {
                btn.addEventListener("click", (e) => {
                    this.selectEmoji(e.target.dataset.emoji)
                })
            }
        )

        document.getElementById("habit-name").addEventListener("input", () => {
            this.clearNameError()
        })
    }

    loadHabits() {
        const saved = localStorage.getItem("habits")
        if (saved) {
            return JSON.parse(saved)
        }

        // Default habits
        return [
            {
                id: "1",
                name: "Beber 2L de agua",
                emoji: "💧",
                frequency: "diaria",
                completed: false,
                streak: 2,
                totalDays: 7,
            },
            {
                id: "2",
                name: "Leer 20 min",
                emoji: "📚",
                frequency: "diaria",
                completed: false,
                streak: 5,
                totalDays: 7,
            },
            {
                id: "3",
                name: "Meditar 5 min",
                emoji: "🧘",
                frequency: "diaria",
                completed: true,
                streak: 3,
                totalDays: 7,
            },
        ]
    }

    saveHabits() {
        localStorage.setItem("habits", JSON.stringify(this.habits))
    }

    showForm() {
        document.getElementById("add-habit-form").classList.remove("hidden")
        document.getElementById("habit-name").focus()
    }

    hideForm() {
        document.getElementById("add-habit-form").classList.add("hidden")
        this.resetForm()
    }

    resetForm() {
        document.getElementById("habit-form").reset()
        this.selectEmoji("🎯")
        this.clearNameError()
    }

    selectEmoji(emoji) {
        document.querySelectorAll(".emoji-btn").forEach((btn) => {
            btn.classList.remove("selected")
        })
        document.querySelector(`[data-emoji="${emoji}"]`).classList.add("selected")
        this.selectedEmoji = emoji
    }

    clearNameError() {
        document.getElementById("name-error").classList.add("hidden")
        document.getElementById("habit-name").style.borderColor = " "
    }

    showNameError(message) {
        const error = document.getElementById("name-error");
        error.textContent = message
        error.classList.remove("hidden")
        document.getElementById("name-error").style.borderColor = "var(--destructive)"
    }

    handleFormSubmit(e) {
        e.preventDefault()

        const name = document.getElementById("habit-name").value.trim()
        const frequency = document.getElementById("frequency").value

        if (!name) {
            this.showNameError("El nombre del hábito no puede estar vacío")
            return
        }

        const newHabit = {
            id: Date.now().toString(),
            name,
            emoji: this.selectedEmoji,
            frequency,
            completed: false,
            streak: 0,
            totalDays: 7,
        }

        this.habits.push(newHabit)
        this.saveHabits()
        this.render()
        this.hideForm()
    }

    toggleHabit(id) {
        const habitIndex = this.habits.findIndex((h) => h.id == id)
        if (habitIndex === -1) return

        const habit = this.habits[habitIndex]
        const wasCompleted = habit.completed

        habit.completed = !habit.completed
        habit.streak = habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)

        this.saveHabits()
        this.render()

        if (!wasCompleted && habit.completed) {
            this.showCompletionAnimation(id)
        }
    }

    showCompletionAnimation(habitId) {
        const habitCard = document.querySelector(`[data-habit-id="${habitId}"]`)
        if (!habitCard) return

        habitCard.classList.add("animating")

        const animation = habitCard.querySelector(".completion-animation")
        if (animation) {
            animation.classList.remove("hidden")

            setTimeout(() => {
                animation.classList.add("hidden")
                habitCard.classList.remove("animating")
            }, 600)
        }
    }

    deleteHabit(id) {
        if (confirm("¿Estas seguro que quieres eliminar este hábito?")) {
            this.habits = this.habits.filter((h) => h.id !== id)
            this.saveHabits()
            this.render()
        }

    }

    getMotivationalMessage(percentage) {
        if (percentage === 100) return "🔥 ¡Sos imparable!"
        if (percentage >= 75) return "🌟 ¡Excelente progreso!"
        if (percentage >= 50) return "💪 ¡Vas por buen camino!"
        if (percentage >= 25) return "🚀 ¡Seguí así!"
        return "💪 ¡Vamos, recién estás empezando!"
    }

    updateRandomQuote() {
        const randomQuote = this.inspirationalQuotes[Math.floor(Math.random() * this.inspirationalQuotes.length)]
        document.getElementById("inspirational-quote").textContent = randomQuote
    }

    renderProgressStats() {
        const completedHabits = this.habits.filter((h) => h.completed).length
        const totalHabits = this.habits.length
        const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

        document.getElementById("completion-percentage").textContent = `${completionPercentage}%`
        document.getElementById("completion-text").textContent = `${completedHabits} de ${totalHabits} hábitos`
        document.getElementById("motivational-message").textContent = this.getMotivationalMessage(completionPercentage)

        document.getElementById("progress-fill").style.width = `${completionPercentage}%`
        document.getElementById("completed-habits").textContent = completedHabits
        document.getElementById("progress-percent").textContent = `${completionPercentage}%`
    }

    renderHabits() {
        const container = document.getElementById("habits-container")
        const emptyState = document.getElementById("empty-state")

        if (this.habits.length === 0) {
            container.innerHTML = ""
            emptyState.classList.remove("hidden")
            return
        }

        emptyState.classList.add("hidden")

        container.innerHTML = this.habits.map(
            (habit) => {
                const progressPercentage = Math.round((habit.streak / habit.totalDays) * 100)

                return `
                    <div class="habit-card ${habit.completed ? "completed" : ""}" data-habit-id="${habit.id}">
                    <div class="habit-header">
                        <div class="habit-info">
                            <span class="habit-emoji">${habit.emoji}</span>
                            <div>
                                <h3 class="habit-name">${habit.name}</h3>
                                <p class="habit-frequency">${habit.frequency}</p>
                            </div>
                        </div>
                        <button class="delete-btn" onclick="habitTracker.deleteHabit('${habit.id}')">
                                <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
                        </button>
                    </div>

                    <div class="habit-actions">
                        <div class="checkbox-container">
                            <div class="checkbox ${habit.completed ? "checked" : ""}" 
                                 onclick="habitTracker.toggleHabit('${habit.id}')"></div>
                            <span class="checkbox-label ${habit.completed ? "completed" : ""}"
                                  onclick="habitTracker.toggleHabit('${habit.id}')">
                                ${habit.completed ? "¡Completado!" : "Marcar como hecho"}
                            </span>
                        </div>

                        ${habit.streak > 0
                        ? `
                            <div class="streak-indicator">
                                <span class="streak-icon">🔥</span>
                                <span class="streak-number">${habit.streak}</span>
                            </div>
                        `
                        : ""
                    }
                    </div>

                    <div class="habit-progress">
                        <div class="progress-header-small">
                            <span class="progress-label">Progreso</span>
                            <span class="progress-text">${habit.streak}/${habit.totalDays} días</span>
                        </div>
                        <div class="progress-bar-small">
                            <div class="progress-fill-small" style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>

                    <div class="completion-animation hidden">🎉</div>
                </div>
                `
            }
        ).join("")

        const addButton = document.createElement("div")
        addButton.className = "habit-card add-habit-card"
        addButton.innerHTML = `
        <button class="add-habit-btn" onclick="habitTracker.showForm()">+</button>
    `
        container.appendChild(addButton)
    }
    render() {
        this.renderProgressStats()
        this.renderHabits()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.habitTracker = new HabitTracker();

    const hero = document.querySelector(".hero");
    if (hero) {
        hero.classList.add("animate__animated", "animate__fadeInDown");
    }

    const hiddenElements = document.querySelectorAll('#progress-stats, .habits-section, footer');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate__animated", "animate__fadeInUp");
                entry.target.classList.remove("hidden-on-load");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const offset = parseInt(getComputedStyle(target).scrollMarginTop) || 0;
                let top = target.getBoundingClientRect().top + window.scrollY - offset;


                top = Math.min(top, document.body.scrollHeight - window.innerHeight);

                window.scrollTo({ top, behavior: "smooth" });
            }
        });
    });


    hiddenElements.forEach(el => observer.observe(el));

    // Toggle modo oscuro
    const toggle = document.getElementById("dark-mode-toggle");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        toggle.checked = true;
    } else {
        document.body.classList.remove("dark-mode");
        toggle.checked = false;
    }

    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-mode") ? "dark" : "light"
        );
    });

    //Navbar
    const navbarToggle = document.querySelector(".navbar-toggle");
    const navbarLinks = document.querySelector(".navbar-links");

    if (navbarToggle && navbarLinks) {
        navbarToggle.addEventListener("click", () => {
            navbarLinks.classList.toggle("active");
        });
    }

    // Modal contacto (solo si existe en el DOM)
    const modal = document.getElementById("contactModal");
    const btn = document.getElementById("contactBtn");
    const span = document.getElementsByClassName("close")[0];

    if (modal && btn && span) {
        btn.onclick = () => modal.style.display = "block";
        span.onclick = () => modal.style.display = "none";
        window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

        document.getElementById("contactForm").addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Mensaje enviado correctamente!");
            modal.style.display = "none";
            e.target.reset();
        });
    }


    const quoteElement = document.getElementById("inspirational-quote");
    if (quoteElement) {
        const quotes = habitTracker.inspirationalQuotes;
        let index = 0;


        quoteElement.textContent = quotes[index];


        setInterval(() => {
            index = (index + 1) % quotes.length;
            quoteElement.textContent = quotes[index];
        }, 6000);
    }
});
