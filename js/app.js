
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);

  const form = $("career-form");
  const steps = [...document.querySelectorAll(".form-step")];
  const nextButton = $("next-button");
  const backButton = $("back-button");
  const resultButton = $("result-button");
  const errorBox = $("form-error");
  const results = $("results");

  let currentStep = 0;
  let latestPlan = null;
  let toastTimer;

  const careers = {
    tech: {
      name: "Tecnologia e desenvolvimento",
      description: "Uma área para investigar soluções digitais, lógica, programação e ferramentas que ajudam a resolver problemas.",
      interests: ["tech", "research"],
      skills: ["logic", "curiosity"],
      environment: ["independent", "team"],
      professions: ["Desenvolvedor de software", "Analista de dados", "Profissional de QA"],
      learn: ["Lógica de programação", "Fundamentos de Python", "Git e GitHub"]
    },
    creative: {
      name: "Criação, design e comunicação",
      description: "Uma possibilidade para quem gosta de transformar ideias em conteúdos, experiências visuais e soluções criativas.",
      interests: ["creative", "business"],
      skills: ["creativity", "communication"],
      environment: ["independent", "team", "varied"],
      professions: ["Designer gráfico", "Designer de interfaces (UI)", "Criador de conteúdo"],
      learn: ["Princípios de design", "Comunicação visual", "Construção de um portfólio de projetos"]
    },
    business: {
      name: "Negócios e empreendedorismo",
      description: "Uma área que envolve organização, planejamento, compreensão de clientes e desenvolvimento de projetos.",
      interests: ["business", "creative"],
      skills: ["organization", "communication"],
      environment: ["team", "varied", "independent"],
      professions: ["Assistente de projetos", "Analista de marketing", "Empreendedor"],
      learn: ["Planejamento de projetos", "Fundamentos de marketing", "Finanças básicas"]
    },
    people: {
      name: "Educação e desenvolvimento humano",
      description: "Um caminho para explorar ensino, orientação, colaboração e atividades que envolvem compreender as necessidades das pessoas.",
      interests: ["people"],
      skills: ["empathy", "communication"],
      environment: ["people", "team"],
      professions: ["Educador", "Profissional de recursos humanos", "Orientador educacional"],
      learn: ["Comunicação interpessoal", "Fundamentos de aprendizagem", "Ética e trabalho em equipe"]
    },
    research: {
      name: "Ciência, pesquisa e análise",
      description: "Uma possibilidade para quem gosta de investigar perguntas, analisar evidências e aprender como os sistemas funcionam.",
      interests: ["research", "tech", "nature"],
      skills: ["logic", "curiosity"],
      environment: ["independent", "team"],
      professions: ["Assistente de pesquisa", "Analista de informações", "Profissional de laboratório"],
      learn: ["Métodos de pesquisa", "Interpretação de dados", "Estatística introdutória"]
    },
    nature: {
      name: "Meio ambiente e sustentabilidade",
      description: "Uma área para conhecer soluções relacionadas à conservação, ao uso responsável de recursos e à sustentabilidade.",
      interests: ["nature", "research", "people"],
      skills: ["curiosity", "organization", "empathy"],
      environment: ["varied", "team", "independent"],
      professions: ["Educador ambiental", "Técnico ambiental", "Analista de sustentabilidade"],
      learn: ["Fundamentos ambientais", "Análise de dados ambientais", "Projetos de sustentabilidade"]
    }
  };

  const interestNames = {
    tech: "tecnologia e resolução de problemas",
    creative: "criação e comunicação",
    business: "organização e negócios",
    people: "atividades com pessoas",
    research: "investigação e pesquisa",
    nature: "natureza e sustentabilidade"
  };

  const goalNames = {
    discover: "descobrir uma profissão",
    learn: "aprender uma nova habilidade",
    "first-job": "preparar-se para o primeiro emprego",
    change: "explorar uma mudança de carreira",
    grow: "crescer profissionalmente",
    business: "explorar o empreendedorismo"
  };

  function notify(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }

  function updateStep() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    const percent = Math.round(((currentStep + 1) / steps.length) * 100);
    $("step-label").textContent =
      `ETAPA ${String(currentStep + 1).padStart(2, "0")} DE ${String(steps.length).padStart(2, "0")}`;
    $("progress-percent").textContent = `${percent}%`;
    $("progress-bar").style.width = `${percent}%`;

    backButton.classList.toggle("hidden", currentStep === 0);
    nextButton.classList.toggle("hidden", currentStep === steps.length - 1);
    resultButton.classList.toggle("hidden", currentStep !== steps.length - 1);

    clearError();
  }

  function validateCurrentStep() {
    const step = steps[currentStep];

    if (currentStep === 1 || currentStep === 2) {
      const group = currentStep === 1 ? "interests" : "skills";
      const selected = step.querySelectorAll(
        `input[name="${group}"]:checked`
      );

      if (!selected.length) {
        showError(
          currentStep === 1
            ? "Selecione pelo menos um interesse para continuar."
            : "Selecione pelo menos uma habilidade para continuar."
        );
        return false;
      }
    }

    const requiredFields = [
      ...step.querySelectorAll("input[required], select[required]")
    ];

    for (const field of requiredFields) {
      if (field.type === "radio") {
        const group = step.querySelectorAll(
          `input[type="radio"][name="${field.name}"]`
        );

        if (![...group].some(radio => radio.checked)) {
          showError("Escolha uma das opções para continuar.");
          group[0]?.focus();
          return false;
        }
      } else if (!field.checkValidity()) {
        showError("Preencha os campos obrigatórios antes de continuar.");
        field.reportValidity();
        return false;
      }
    }

    clearError();
    return true;
  }

  nextButton.addEventListener("click", () => {
    if (!validateCurrentStep()) return;

    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStep();
    }
  });

  backButton.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });

  function collectAnswers() {
    const data = new FormData(form);

    return {
      name: String(data.get("name") || "").trim(),
      experience: String(data.get("experience") || ""),
      interests: data.getAll("interests"),
      skills: data.getAll("skills"),
      environment: String(data.get("environment") || ""),
      goal: String(data.get("goal") || ""),
      availability: String(data.get("availability") || ""),
      extra: String(data.get("extra") || "").trim()
    };
  }

  function scoreCareers(answers) {
    return Object.entries(careers)
      .map(([id, career]) => {
        let score = 0;
        const reasons = [];

        const interestMatches = career.interests.filter(
          item => answers.interests.includes(item)
        );

        const skillMatches = career.skills.filter(
          item => answers.skills.includes(item)
        );

        const environmentMatches = career.environment.includes(
          answers.environment
        );

        score += interestMatches.length * 4;
        score += skillMatches.length * 3;

        if (environmentMatches) score += 2;

        if (answers.goal === "business" && id === "business") score += 3;
        if (answers.goal === "learn" && id === "tech") score += 1;
        if (answers.goal === "change" && id === "creative") score += 1;

        if (interestMatches.length) {
          reasons.push(
            `Seus interesses incluem ${interestMatches.map(item => interestNames[item]).join(" e ")}.`
          );
        }

        if (skillMatches.length) {
          reasons.push(
            `Você identificou habilidades relacionadas a ${skillMatches.map(skill => ({
              logic: "raciocínio lógico",
              communication: "comunicação",
              creativity: "criatividade",
              organization: "organização",
              empathy: "empatia",
              curiosity: "curiosidade"
            })[skill]).join(" e ")}.`
          );
        }

        if (environmentMatches) {
          reasons.push("O ambiente selecionado também pode combinar com atividades desta área.");
        }

        if (!reasons.length) {
          reasons.push("Esta é uma área complementar que pode ampliar seu repertório profissional.");
        }

        return {
          id,
          career,
          score,
          reasons,
          matches: interestMatches.length + skillMatches.length
        };
      })
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
      .slice(0, 3);
  }

  function buildRoadmap(answers, topCareer) {
    const studyTime = {
      "15": "Reserve 15 a 30 minutos por dia, começando com uma atividade curta.",
      "30": "Organize aproximadamente uma hora diária para estudar e praticar.",
      "60": "Divida seu tempo entre estudo, prática e revisão, sem comprometer seu descanso.",
      flexible: "Escolha dois ou três períodos possíveis na semana e ajuste conforme sua rotina."
    };

    const goalStep = {
      discover: "Pesquise três profissões da área, compare suas atividades e converse com alguém que conheça uma delas.",
      learn: `Escolha um dos fundamentos sugeridos em ${topCareer.career.name} e conclua uma atividade introdutória.`,
      "first-job": "Pesquise requisitos de vagas iniciais, identifique habilidades recorrentes e prepare um currículo adequado à sua experiência.",
      change: "Converse com profissionais da área, investigue os requisitos e experimente um pequeno projeto antes de decidir.",
      grow: "Identifique uma competência exigida na sua área de interesse e pratique-a em um projeto concreto.",
      business: "Descreva um problema que gostaria de resolver, seu público e uma forma simples de testar sua ideia."
    };

    return [
      {
        title: "Conheça a área",
        detail: `Leia sobre ${topCareer.career.name.toLowerCase()} e observe as atividades do dia a dia, as responsabilidades e os caminhos de formação.`
      },
      {
        title: "Aprenda um fundamento",
        detail: `Explore: ${topCareer.career.learn[0]}. Procure uma aula introdutória gratuita e registre o que aprendeu.`
      },
      {
        title: "Coloque em prática",
        detail: `Faça uma atividade simples relacionada a ${topCareer.career.name.toLowerCase()}, usando recursos disponíveis para iniciantes.`
      },
      {
        title: "Defina o próximo passo",
        detail: `${goalStep[answers.goal]} ${studyTime[answers.availability]}`
      }
    ];
  }

  function renderResults(answers, ranked, roadmap) {
    const first = ranked[0];

    $("result-title").textContent = `${answers.name}, vamos explorar seu potencial.`;
    $("result-description").textContent =
      `Seu perfil sugere áreas que vale a pena investigar para ${goalNames[answers.goal]}. Veja as possibilidades abaixo.`;

    const grid = $("recommendation-grid");
    grid.replaceChildren();

    ranked.forEach((item, index) => {
      const article = document.createElement("article");
      article.className =
        "recommendation-card" + (index === 0 ? " best-match" : "");

      const label = document.createElement("div");
      label.className = "match-label";

      const labelText = document.createElement("span");
      labelText.textContent = index === 0 ? "PRIMEIRA SUGESTÃO" : `ALTERNATIVA 0${index + 1}`;

      const score = document.createElement("span");
      score.className = "match-score";
      score.textContent = `${item.matches} correspondência(s)`;

      label.append(labelText, score);

      const title = document.createElement("h3");
      title.textContent = item.career.name;

      const description = document.createElement("p");
      description.textContent = item.career.description;

      const reasonTitle = document.createElement("h4");
      reasonTitle.textContent = "POR QUE EXPLORAR ESTA ÁREA?";

      const reasons = document.createElement("ul");
      item.reasons.forEach(reason => {
        const li = document.createElement("li");
        li.textContent = reason;
        reasons.append(li);
      });

      const professionTitle = document.createElement("h4");
      professionTitle.textContent = "EXEMPLOS DE PROFISSÕES";

      const professions = document.createElement("ul");
      item.career.professions.forEach(profession => {
        const li = document.createElement("li");
        li.textContent = profession;
        professions.append(li);
      });

      article.append(
        label, title, description, reasonTitle, reasons,
        professionTitle, professions
      );

      grid.append(article);
    });

    const roadmapList = $("roadmap-list");
    roadmapList.replaceChildren();

    roadmap.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "roadmap-item";

      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");

      const content = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.title;

      const description = document.createElement("p");
      description.textContent = item.detail;

      content.append(title, description);
      row.append(number, content);
      roadmapList.append(row);
    });

    results.classList.remove("hidden");
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!validateCurrentStep()) return;

    const answers = collectAnswers();
    const ranked = scoreCareers(answers);
    const roadmap = buildRoadmap(answers, ranked[0]);

    latestPlan = { answers, ranked, roadmap };
    renderResults(answers, ranked, roadmap);

    notify("Seu mapa de possibilidades está pronto.");
  });

  $("download-plan").addEventListener("click", () => {
    if (!latestPlan) {
      notify("Preencha o questionário para criar seu plano.");
      return;
    }

    const { answers, ranked, roadmap } = latestPlan;

    const lines = [
      "CAREERMENTOR AI — MEU PLANO DE CARREIRA",
      "=".repeat(42),
      "",
      `Nome: ${answers.name}`,
      `Objetivo: ${goalNames[answers.goal]}`,
      "",
      "ÁREAS PARA EXPLORAR",
      ...ranked.flatMap((item, index) => [
        "",
        `${index + 1}. ${item.career.name}`,
        item.career.description,
        "Possíveis profissões: " + item.career.professions.join(", "),
        "Sugestões de aprendizagem: " + item.career.learn.join(", ")
      ]),
      "",
      "MEU PLANO DE AÇÃO",
      ...roadmap.flatMap((item, index) => [
        "",
        `${index + 1}. ${item.title}`,
        item.detail
      ]),
      "",
      "Observação: estas sugestões são exploratórias e não constituem",
      "diagnóstico profissional nem garantia de empregabilidade.",
      "",
      "Gerado pelo CareerMentor AI — projeto educacional."
    ];

    const blob = new Blob(
      ["\uFEFF" + lines.join("\n")],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "meu-plano-de-carreira.txt";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    notify("Seu plano foi preparado para download.");
  });

  $("restart-button").addEventListener("click", () => {
    form.reset();
    currentStep = 0;
    latestPlan = null;
    updateStep();
    $("encrypt-count")?.replaceChildren();
    results.classList.add("hidden");
    $("mentor").scrollIntoView({ behavior: "smooth" });
    notify("Você pode preencher um novo perfil.");
  });

  // Links das áreas preenchem um interesse no questionário.
  document.querySelectorAll("[data-interest]").forEach(link => {
    link.addEventListener("click", () => {
      const interest = link.dataset.interest;
      const checkbox = form.querySelector(
        `input[name="interests"][value="${interest}"]`
      );

      if (checkbox) checkbox.checked = true;
    });
  });

  updateStep();
});
