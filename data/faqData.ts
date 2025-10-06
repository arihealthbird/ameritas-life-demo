import type { FAQCategory } from "@/types/faq"

export const faqCategories: FAQCategory[] = [
  {
    id: "general",
    faqs: [
      {
        question: "What is HealthBird?",
        questionEs: "¿Qué es HealthBird?",
        answer:
          "HealthBird is a modern health insurance platform that helps you find, compare, and enroll in the right health insurance plan for your needs. We use AI to simplify the process and provide personalized recommendations.",
        answerEs:
          "HealthBird es una plataforma moderna de seguros de salud que te ayuda a encontrar, comparar e inscribirte en el plan de seguro de salud adecuado para tus necesidades. Utilizamos IA para simplificar el proceso y proporcionar recomendaciones personalizadas.",
      },
      {
        question: "How does HealthBird work?",
        questionEs: "¿Cómo funciona HealthBird?",
        answer:
          "HealthBird combines advanced AI technology with licensed insurance experts to help you navigate the health insurance marketplace. Simply tell us about your healthcare needs, doctors, and medications, and we'll match you with the best plans available in your area.",
        answerEs:
          "HealthBird combina tecnología avanzada de IA con expertos en seguros licenciados para ayudarte a navegar por el mercado de seguros de salud. Simplemente cuéntanos sobre tus necesidades de atención médica, médicos y medicamentos, y te conectaremos con los mejores planes disponibles en tu área.",
      },
      {
        question: "Is HealthBird free to use?",
        questionEs: "¿Es gratis usar HealthBird?",
        answer:
          "Yes, HealthBird is completely free to use. We're compensated by insurance companies when you enroll in a plan, but this never affects our recommendations or the price you pay.",
        answerEs:
          "Sí, HealthBird es completamente gratuito. Recibimos compensación de las compañías de seguros cuando te inscribes en un plan, pero esto nunca afecta nuestras recomendaciones o el precio que pagas.",
      },
      {
        question: "Is my information secure with HealthBird?",
        questionEs: "¿Está segura mi información con HealthBird?",
        answer:
          "Absolutely. We take data security and privacy very seriously. All your personal information is encrypted and securely stored. We never sell your data to third parties.",
        answerEs:
          "Absolutamente. Nos tomamos muy en serio la seguridad y privacidad de los datos. Toda tu información personal está encriptada y almacenada de forma segura. Nunca vendemos tus datos a terceros.",
      },
    ],
  },
  {
    id: "plans",
    faqs: [
      {
        question: "What types of health insurance plans does HealthBird offer?",
        questionEs: "¿Qué tipos de planes de seguro de salud ofrece HealthBird?",
        answer:
          "HealthBird helps you shop for individual and family health insurance plans, including Marketplace/ACA plans, Medicare, short-term health insurance, and dental/vision coverage. Our platform includes plans from all major insurance carriers.",
        answerEs:
          "HealthBird te ayuda a comprar planes de seguro médico individuales y familiares, incluidos los planes del Mercado/ACA, Medicare, seguro médico a corto plazo y cobertura dental/visual. Nuestra plataforma incluye planes de todas las principales aseguradoras.",
      },
      {
        question: "How do I know which plan is best for me?",
        questionEs: "¿Cómo sé qué plan es el mejor para mí?",
        answer:
          "Our AI-powered recommendation engine analyzes thousands of plans based on your specific needs, preferences, doctors, and medications. We consider factors like premium costs, deductibles, out-of-pocket maximums, and coverage to suggest plans that provide the best value for your situation.",
        answerEs:
          "Nuestro motor de recomendación impulsado por IA analiza miles de planes según tus necesidades específicas, preferencias, médicos y medicamentos. Consideramos factores como costos de prima, deducibles, máximos de gastos de bolsillo y cobertura para sugerir planes que proporcionen el mejor valor para tu situación.",
      },
      {
        question: "Can I keep my current doctors with plans on HealthBird?",
        questionEs: "¿Puedo mantener mis médicos actuales con los planes en HealthBird?",
        answer:
          "Yes, our doctor search feature allows you to input your preferred doctors, and we'll show you which plans include them in-network. This helps ensure you can maintain continuity of care with your current healthcare providers.",
        answerEs:
          "Sí, nuestra función de búsqueda de médicos te permite ingresar tus médicos preferidos, y te mostraremos qué planes los incluyen dentro de la red. Esto ayuda a garantizar que puedas mantener la continuidad de la atención con tus proveedores de atención médica actuales.",
      },
      {
        question: "Are my prescriptions covered?",
        questionEs: "¿Están cubiertos mis medicamentos recetados?",
        answer:
          "Our medication search feature allows you to enter your current prescriptions, and we'll show you which plans cover them and at what cost. This helps you avoid surprise pharmacy expenses after enrolling.",
        answerEs:
          "Nuestra función de búsqueda de medicamentos te permite ingresar tus recetas actuales, y te mostraremos qué planes las cubren y a qué costo. Esto te ayuda a evitar gastos sorpresa de farmacia después de inscribirte.",
      },
    ],
  },
  {
    id: "enrollment",
    faqs: [
      {
        question: "How do I enroll in a health insurance plan?",
        questionEs: "¿Cómo me inscribo en un plan de seguro de salud?",
        answer:
          "Enrolling through HealthBird is simple. After finding a plan you like, you can complete the entire enrollment process online through our secure platform. In some cases, you may need to call our licensed agents to complete enrollment, and we'll guide you through that process.",
        answerEs:
          "Inscribirse a través de HealthBird es simple. Después de encontrar un plan que te guste, puedes completar todo el proceso de inscripción en línea a través de nuestra plataforma segura. En algunos casos, es posible que debas llamar a nuestros agentes licenciados para completar la inscripción, y te guiaremos a través de ese proceso.",
      },
      {
        question: "When can I enroll in health insurance?",
        questionEs: "¿Cuándo puedo inscribirme en un seguro médico?",
        answer:
          "You can typically enroll during the annual Open Enrollment Period (usually November to mid-December for coverage starting January 1). However, you may qualify for a Special Enrollment Period if you've experienced certain life events like losing coverage, moving, getting married, having a baby, or adopting a child.",
        answerEs:
          "Por lo general, puedes inscribirte durante el Período de Inscripción Abierta anual (generalmente de noviembre a mediados de diciembre para cobertura que comienza el 1 de enero). Sin embargo, puedes calificar para un Período de Inscripción Especial si has experimentado ciertos eventos de vida como perder cobertura, mudarte, casarte, tener un bebé o adoptar un niño.",
      },
      {
        question: "What subsidies am I eligible for?",
        questionEs: "¿Para qué subsidios soy elegible?",
        answer:
          "Many individuals and families qualify for premium tax credits (subsidies) that lower monthly premium costs. Our subsidy calculator estimates your eligibility based on your household size, income, and location. Some people may also qualify for cost-sharing reductions that lower deductibles and out-of-pocket costs.",
        answerEs:
          "Muchas personas y familias califican para créditos fiscales para primas (subsidios) que reducen los costos mensuales de las primas. Nuestra calculadora de subsidios estima tu elegibilidad según el tamaño de tu hogar, ingresos y ubicación. Algunas personas también pueden calificar para reducciones de costos compartidos que disminuyen los deducibles y los gastos de bolsillo.",
      },
      {
        question: "How long does it take to get covered after I enroll?",
        questionEs: "¿Cuánto tiempo toma obtener cobertura después de inscribirme?",
        answer:
          "For Marketplace plans, coverage typically begins on the 1st of the month after you enroll. If you enroll during Open Enrollment, your coverage will start on January 1. For Special Enrollment Periods, coverage usually begins the 1st of the month after your application is processed.",
        answerEs:
          "Para los planes del Mercado, la cobertura generalmente comienza el 1 del mes después de inscribirte. Si te inscribes durante la Inscripción Abierta, tu cobertura comenzará el 1 de enero. Para los Períodos de Inscripción Especial, la cobertura generalmente comienza el 1 del mes después de que se procese tu solicitud.",
      },
    ],
  },
  {
    id: "support",
    faqs: [
      {
        question: "How can I contact HealthBird for help?",
        questionEs: "¿Cómo puedo contactar a HealthBird para obtener ayuda?",
        answer:
          "You can reach our customer support team via live chat on our website, by phone at 1-800-HEALTH-BIRD (1-800-432-5842), or by email at support@healthbird.com. Our licensed agents are available Monday through Friday, 8am to 8pm EST.",
        answerEs:
          "Puedes comunicarte con nuestro equipo de atención al cliente a través del chat en vivo en nuestro sitio web, por teléfono al 1-800-HEALTH-BIRD (1-800-432-5842), o por correo electrónico a support@healthbird.com. Nuestros agentes licenciados están disponibles de lunes a viernes, de 8am a 8pm EST.",
      },
      {
        question: "What should I do if I need to see a doctor before my coverage starts?",
        questionEs: "¿Qué debo hacer si necesito ver a un médico antes de que comience mi cobertura?",
        answer:
          "If you need medical care before your coverage begins, consider visiting a community health center or urgent care clinic, which often provide services at reduced costs. For emergencies, hospital emergency rooms must provide care regardless of insurance status. Our support team can also help you explore temporary coverage options.",
        answerEs:
          "Si necesitas atención médica antes de que comience tu cobertura, considera visitar un centro de salud comunitario o una clínica de atención urgente, que a menudo brindan servicios a costos reducidos. Para emergencias, las salas de emergencia del hospital deben proporcionar atención independientemente del estado del seguro. Nuestro equipo de soporte también puede ayudarte a explorar opciones de cobertura temporal.",
      },
      {
        question: "Can you help me understand my bill?",
        questionEs: "¿Pueden ayudarme a entender mi factura?",
        answer:
          "Yes, our support team includes billing specialists who can help explain your medical bills and insurance statements. We can clarify confusing charges and help you resolve billing issues with providers or insurance companies.",
        answerEs:
          "Sí, nuestro equipo de soporte incluye especialistas en facturación que pueden ayudarte a explicar tus facturas médicas y estados de cuenta del seguro. Podemos aclarar cargos confusos y ayudarte a resolver problemas de facturación con proveedores o compañías de seguros.",
      },
      {
        question: "What resources does HealthBird offer to help me understand health insurance?",
        questionEs: "¿Qué recursos ofrece HealthBird para ayudarme a entender el seguro médico?",
        answer:
          "HealthBird provides a comprehensive educational library with articles, videos, and glossaries explaining health insurance concepts in plain language. Our BirdyAI assistant can answer your specific questions 24/7, and we offer personalized consultations with licensed agents to address more complex situations.",
        answerEs:
          "HealthBird proporciona una biblioteca educativa completa con artículos, videos y glosarios que explican los conceptos de seguro médico en un lenguaje sencillo. Nuestro asistente BirdyAI puede responder tus preguntas específicas las 24 horas del día, los 7 días de la semana, y ofrecemos consultas personalizadas con agentes licenciados para abordar situaciones más complejas.",
      },
    ],
  },
]
