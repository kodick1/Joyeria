"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getSavedProducts, saveProduct } from "@/lib/product-storage";
import { demoProducts, type Product } from "@/lib/products";

const schema = z
  .object({
    name: z.string().trim().min(2, "Escribe el nombre de la pieza."),
    description: z.string().trim().min(10, "Añade una descripción de al menos 10 caracteres."),
    shortDescription: z.string().trim().min(2, "Añade una descripción breve."),
    category: z.enum(["anillos", "collares", "pulseras", "aretes", "dijes", "relojes", "sets"]),
    collection: z.string().trim().min(1, "Indica la colección."),
    metal: z.enum(["oro_18k", "oro_14k", "oro_blanco", "oro_rosa", "plata_925", "platino", "acero"]),
    gemstone: z.enum(["diamante", "esmeralda", "zafiro", "rubi", "perla", "circon", "ninguna"]),
    weightGrams: z.number().positive("El peso debe ser mayor a cero."),
    size: z.string(),
    price: z.number().positive("El precio debe ser mayor a cero."),
    stock: z.number().int().min(0, "El inventario no puede ser negativo."),
    isFeatured: z.boolean()
  })
  .superRefine((product, context) => {
    if (["anillos", "collares", "pulseras"].includes(product.category) && !product.size.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["size"],
        message: "Indica la talla o el largo."
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const acceptedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

const fields: {
  name: keyof FormValues;
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
}[] = [
  { name: "name", label: "Nombre de la pieza" },
  { name: "shortDescription", label: "Descripción breve" },
  { name: "description", label: "Descripción", type: "textarea" },
  {
    name: "category",
    label: "Categoría",
    options: ["anillos", "collares", "pulseras", "aretes", "dijes", "relojes", "sets"].map((value) => ({
      value,
      label: value
    }))
  },
  { name: "collection", label: "Colección" },
  {
    name: "metal",
    label: "Metal",
    options: ["oro_18k", "oro_14k", "oro_blanco", "oro_rosa", "plata_925", "platino", "acero"].map(
      (value) => ({ value, label: value.replace("_", " ") })
    )
  },
  {
    name: "gemstone",
    label: "Piedra",
    options: ["diamante", "esmeralda", "zafiro", "rubi", "perla", "circon", "ninguna"].map((value) => ({
      value,
      label: value
    }))
  },
  { name: "weightGrams", label: "Peso (gramos)", type: "number" },
  { name: "size", label: "Talla o largo" },
  { name: "price", label: "Precio (COP)", type: "number" },
  { name: "stock", label: "Unidades disponibles", type: "number" }
];

export function ProductForm() {
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "anillos",
      metal: "oro_18k",
      gemstone: "diamante",
      collection: "Eternidad",
      size: "",
      stock: 0,
      isFeatured: false
    }
  });
  const values = watch();

  useEffect(() => {
    const previewUrls = photos.map((photo) => URL.createObjectURL(photo));
    setPhotoPreviews(previewUrls);
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  const submit = handleSubmit(async (data) => {
    setSaving(true);
    setFeedback("");
    setFeedbackIsError(false);
    try {
      const savedProducts = await getSavedProducts();
      const allProducts = [...demoProducts, ...savedProducts];
      const skuPrefix = `AUR-${data.category.slice(0, 3).toUpperCase()}-`;
      const usedSkus = new Set(allProducts.map((product) => product.sku));
      let sequence = allProducts.filter((product) => product.sku.startsWith(skuPrefix)).length + 1;
      let sku = `${skuPrefix}${String(sequence).padStart(4, "0")}`;
      while (usedSkus.has(sku)) {
        sequence += 1;
        sku = `${skuPrefix}${String(sequence).padStart(4, "0")}`;
      }

      const baseSlug = data.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
      const images = await Promise.all(
        photos.map(async (photo, index) => ({
          url: await optimizePhoto(photo),
          alt: `${data.name}, vista ${index + 1}`
        }))
      );
      const product: Product = {
        ...data,
        id: crypto.randomUUID(),
        sku,
        slug,
        shortDescription: data.shortDescription,
        collection: data.collection,
        category: data.category,
        metal: data.metal,
        gemstone: data.gemstone,
        caratWeight: null,
        weightGrams: data.weightGrams,
        size: data.size,
        price: data.price,
        compareAtPrice: null,
        stock: data.stock,
        lowStockThreshold: 3,
        isActive: true,
        isNew: true,
        hasCertificate: data.gemstone === "diamante" || data.gemstone === "esmeralda",
        images
      };
      await saveProduct(product);
      setFeedback(
        `“${product.name}” quedó publicada con ${images.length} foto${images.length === 1 ? "" : "s"}.`
      );
      setPublishedSlug(product.slug);
      setPhotos([]);
      window.history.replaceState(null, "", `/admin/productos/nuevo?pieza=${product.slug}`);
    } catch (error) {
      setFeedbackIsError(true);
      setFeedback(error instanceof Error ? error.message : "No se pudo guardar la pieza en este navegador.");
    } finally {
      setSaving(false);
    }
  });

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files);
    const invalid = selected.find(
      (file) => !acceptedPhotoTypes.includes(file.type) || file.size > 8 * 1024 * 1024
    );
    if (invalid) {
      setPhotoError("Selecciona imágenes JPG, PNG o WebP de máximo 8 MB cada una.");
      return;
    }
    if (photos.length + selected.length > 5) {
      setPhotoError("Puedes agregar hasta 5 fotos por pieza.");
      return;
    }
    setPhotoError("");
    setPhotos((current) => [...current, ...selected]);
  };

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section className="rounded-luxury border border-border bg-white p-6 md:p-8">
          <h2 className="font-display text-3xl">Información de la pieza</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <label
                key={field.name}
                className={`block text-xs text-muted ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
              >
                {field.label}
                {field.options ? (
                  <select
                    {...register(field.name)}
                    className="mt-2 block w-full border border-border bg-white px-3 py-3 text-sm text-ink"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    {...register(field.name)}
                    rows={4}
                    className="mt-2 block w-full border border-border px-3 py-3 text-sm text-ink"
                  />
                ) : (
                  <input
                    {...register(field.name, field.type === "number" ? { valueAsNumber: true } : undefined)}
                    type={field.type ?? "text"}
                    className="mt-2 block w-full border border-border px-3 py-3 text-sm text-ink"
                  />
                )}
                {errors[field.name]?.message && (
                  <span className="mt-1 block text-error">{errors[field.name]?.message}</span>
                )}
              </label>
            ))}
          </div>
        </section>
        <section className="rounded-luxury border border-border bg-white p-6 md:p-8">
          <div>
            <p className="text-[10px] uppercase tracking-[.18em] text-gold">Fotografía de producto</p>
            <h2 className="mt-2 font-display text-3xl">Fotos del diseño</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Estas imágenes se mostrarán en la vitrina y en la galería que verá el cliente.
            </p>
          </div>
          <label className="mt-5 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-luxury border border-dashed border-[#c9b991] bg-ivory px-5 py-8 text-center transition hover:bg-[#f4eee3]">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-gold">
              <Upload size={19} />
            </span>
            <span className="mt-3 text-sm font-medium text-ink">Seleccionar fotos</span>
            <span className="mt-1 text-xs text-muted">
              JPG, PNG o WebP · hasta 5 imágenes · 8 MB cada una
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event) => {
                addPhotos(event.currentTarget.files);
                event.currentTarget.value = "";
              }}
              className="sr-only"
              aria-label="Subir fotos del diseño"
            />
          </label>
          {photoError && (
            <p role="alert" className="mt-3 text-xs text-error">
              {photoError}
            </p>
          )}
          {photos.length > 0 ? (
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {photos.map((photo, index) => (
                <li key={`${photo.name}-${photo.lastModified}-${index}`} className="group relative">
                  {photoPreviews[index] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoPreviews[index]}
                      alt={`Vista previa ${index + 1}: ${photo.name}`}
                      className="aspect-[4/5] w-full rounded object-cover"
                    />
                  )}
                  <span className="mt-1 block truncate text-[10px] text-muted">{photo.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))
                    }
                    aria-label={`Quitar foto ${index + 1}`}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-error shadow-soft"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <ImagePlus size={15} /> Aún no has agregado fotos. Puedes publicar la pieza y añadirlas después.
            </p>
          )}
          <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-border pt-5 text-sm text-ink">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(event) => setValue("isFeatured", event.target.checked)}
              className="mt-0.5 accent-[#b8975a]"
            />
            Destacar esta pieza en la portada
          </label>
        </section>
        {feedback && (
          <p
            role={feedbackIsError ? "alert" : "status"}
            className={`border bg-white p-4 text-sm ${feedbackIsError ? "border-error/30 text-error" : "border-gold/30 text-ink"}`}
            aria-live="polite"
          >
            {feedback}
            {!feedbackIsError && publishedSlug && (
              <Link href={`/joyas/${publishedSlug}`} className="ml-2 underline underline-offset-4">
                Ver pieza en la tienda
              </Link>
            )}
          </p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald px-6 py-4 text-xs uppercase tracking-widest text-white disabled:opacity-60"
          >
            {saving ? "Publicando pieza…" : "Publicar pieza"}
          </button>
          <Link href="/admin" className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
            Cancelar
          </Link>
          <span className="sr-only" aria-live="polite">
            {saving ? "Preparando vista previa" : ""}
          </span>
        </div>
      </div>
      <aside className="h-fit rounded-luxury border border-border bg-white p-6">
        <p className="text-[10px] uppercase tracking-widest text-gold">Vista previa</p>
        <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-luxury bg-[#eee9e0]">
          {photoPreviews[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreviews[0]}
              alt="Vista previa del diseño"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_43%,#e2c98e_0_12%,transparent_13%),radial-gradient(ellipse_at_50%_43%,transparent_0_19%,#b8975a_20%_21%,transparent_22%),linear-gradient(145deg,#f5f0e6,#e8dfd0)]" />
          )}
        </div>
        <h3 className="mt-4 font-display text-2xl">{values.name || "Nombre de la pieza"}</h3>
        <p className="mt-1 text-xs text-muted">{values.shortDescription || "Descripción breve"}</p>
        <p className="mt-4 text-sm">
          {values.price > 0
            ? new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
              }).format(values.price)
            : "Precio"}
        </p>
      </aside>
    </form>
  );
}

async function optimizePhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("No se pudo preparar la foto. Intenta con otra imagen.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("No se pudo procesar la foto seleccionada."))),
      "image/webp",
      0.82
    );
  });
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("No se pudo leer la foto procesada."));
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer la foto procesada."));
    reader.readAsDataURL(blob);
  });
}
