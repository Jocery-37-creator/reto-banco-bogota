import type React from "react"
import { useRef, useState } from "react"
import {
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react"

// Define la estructura de los datos de texto del formulario
type FormState = {
  fullName: string
  email: string
  career: string
  semester: string
}
// Define los posibles errores de validación para cada campo
type FormErrors = Partial<Record<keyof FormState | "resume", string>>

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

// Componente principal para el registro de nuevos candidatos
export function PracticanteForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    career: "",
    semester: "",
  })
  const [resume, setResume] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Actualiza el valor de un campo y limpia su mensaje de error en pantalla
  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  // Comprueba que el archivo cumpla con el formato PDF y el peso permitido
  function validateFile(file: File): string | null {
    if (file.type !== "application/pdf") {
      return "El archivo debe estar en formato PDF."
    }
    if (file.size > MAX_FILE_SIZE) {
      return "El archivo no debe superar los 5 MB."
    }
    return null
  }

  // Procesa el documento seleccionado y asigna el archivo o el error correspondiente
  function handleFile(file: File | undefined | null) {
    if (!file) return
    const error = validateFile(file)
    if (error) {
      setErrors((prev) => ({ ...prev, resume: error }))
      setResume(null)
      return
    }
    setErrors((prev) => ({ ...prev, resume: undefined }))
    setResume(file)
  }

  // Captura y procesa el archivo cuando el usuario lo suelta sobre el área de carga
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  // Envio de formulario 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validaciones locales básicas antes de enviar
    const newErrors: FormErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = "El nombre completo es obligatorio."

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim()) {newErrors.email = "El correo electrónico es obligatorio."} else if (!emailRegex.test(form.email)) {
      newErrors.email = "Ingresa un correo electrónico válido (ej: usuario@correo.com)."
    }
    
    if (!form.career.trim()) newErrors.career = "La carrera universitaria es obligatoria."
    if (!form.semester.trim()) { newErrors.semester = "El semestre actual es obligatorio." } else if (Number(form.semester) < 1) {
      newErrors.semester = "El semestre debe ser mayor a 0."
    }
    if (!resume) newErrors.resume = "La hoja de vida en formato PDF es obligatoria."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    // Construcción del FormData mapeando las llaves de React con los atributos del DTO de Java
    const formData = new FormData()
    formData.append("nombreCompleto", form.fullName)
    formData.append("correoElectronico", form.email)
    formData.append("carreraUniversitaria", form.career)
    formData.append("semestreActual", form.semester)
    if (resume) {
      formData.append("hojaDeVida", resume)
    }

    try {
      const response = await fetch("http://localhost:8080/api/practicantes", {
        method: "POST",
        body: formData,
      })

      //
      if (response.status === 409) {
        const mensajeServidor = await response.text()


        setErrors((prev) => ({
          ...prev,
          email: mensajeServidor
        }))

        setSubmitting(false)
        return // Detenemos el flujo para que no marque como enviado exitoso
      }

      if (response.ok) {
        setSubmitted(true)
        // Se limpian los campos
        setForm({
          fullName: "",
          email: "",
          career: "",
          semester: "",
        })
        setResume(null)
      } else {
        // Por si ocurre otro tipo de error 
        const textoError = await response.text()
        alert("Ocurrió un inconveniente al registrar la postulación: " + textoError)
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error)
      alert("No se pudo establecer conexión con el servidor de Spring Boot.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Encabezado */}
      <header className="mb-8 flex flex-col items-center text-center">
        <img
          src="/LogoBg.png"
          alt="Logo Banco de Bogotá"
          className="h-16 w-auto object-contain"
        />
        <h1 className="mt-6 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Registro de Practicantes
        </h1>
        <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          Completa el siguiente formulario para postularte al programa de
          prácticas del Banco de Bogotá. Los campos marcados con{" "}
          <span className="font-medium text-brand-red">*</span> son
          obligatorios.
        </p>
      </header>

      {/* Contenido: formulario o confirmación */}
      {submitted ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/10">
            <CheckCircle2 className="size-8 text-brand" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-card-foreground">
            ¡Solicitud enviada!
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            Gracias, {form.fullName.split(" ")[0] || "practicante"}. Hemos recibido
            tu solicitud. El equipo de Talento Humano del Banco de Bogotá se pondrá
            en contacto contigo pronto.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline decoration-transparent transition-all hover:decoration-brand/50 hover:text-brand/80"
            >
              <span>←</span> Volver a registrar otro candidato
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8"
        >
          <div className="grid gap-5">
            {/* Nombre completo */}
            <Field
              label="Nombre completo"
              htmlFor="fullName"
              required
              error={errors.fullName}
            >
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Ej. Ana María Rodríguez"
                aria-invalid={!!errors.fullName}
                className={inputClass(!!errors.fullName)}
              />
            </Field>

            {/* Correo electrónico */}
            <Field
              label="Correo electrónico"
              htmlFor="email"
              required
              error={errors.email}
            >
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="nombre@correo.com"
                aria-invalid={!!errors.email}
                className={inputClass(!!errors.email)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Carrera universitaria */}
              <Field label="Carrera universitaria" htmlFor="career" required error={errors.career}>
                <input
                  id="career"
                  type="text"
                  value={form.career}
                  onChange={(e) => updateField("career", e.target.value)}
                  placeholder="Ej. Administración de Empresas"
                  aria-invalid={!!errors.fullName}
                  className={inputClass(!!errors.career)}
                />
              </Field>

              {/* Semestre actual */}
              <Field
                label="Semestre actual"
                htmlFor="semester"
                error={errors.semester}
                required
              >
                <input
                  id="semester"
                  type="number"
                  min={1}
                  max={20}
                  value={form.semester}
                  onChange={(e) => updateField("semester", e.target.value)}
                  placeholder="Ej. 8"
                  aria-invalid={!!errors.semester}
                  className={inputClass(!!errors.semester)}
                />
              </Field>
            </div>

            {/* Hoja de vida - Drag & Drop */}
            <Field
              label="Hoja de vida (PDF)"
              htmlFor="resume"
              required
              error={errors.resume}
            >
              {resume ? (
                <div className="flex items-center min-w-0 justify-between gap-3 rounded-xl border border-border bg-secondary/50 p-3">
                  <div className="flex min-w-0 items-center gap-3 w-full min-w-0">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                      <FileText className="size-5 shrink-0 text-brand" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {resume.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResume(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-brand-red/10 hover:text-brand-red"
                    aria-label="Eliminar archivo"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${isDragging
                    ? "border-brand bg-brand/5"
                    : errors.resume
                      ? "border-destructive/60 bg-destructive/5"
                      : "border-border bg-secondary/30 hover:border-brand/60 hover:bg-brand/5"
                    }`}
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-brand/10">
                    <UploadCloud className="size-5 text-brand" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-sm font-medium text-card-foreground">
                    Arrastra y suelta tu hoja de vida aquí
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    o{" "}
                    <span className="font-medium text-brand underline-offset-2 hover:underline">
                      selecciona un archivo
                    </span>{" "}
                    · Solo PDF · Máx. 5 MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Enviando...
                </>
              ) : (
                "Enviar Solicitud"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Nota de privacidad */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Tus datos serán tratados conforme a la política de privacidad del
        Banco de Bogotá.
      </p>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-card-foreground"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-brand-red" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return `h-11 w-full rounded-xl border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${hasError
    ? "border-destructive focus-visible:ring-destructive/40"
    : "border-input focus-visible:border-brand focus-visible:ring-brand/30"
    }`
}