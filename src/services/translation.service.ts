import { TranslationRepository } from "@/repositories/translation.repository";
import type { Translation } from "@/types/translation";
import type {
  TranslationInput,
  UpdateTranslationInput,
} from "@/validators/translation";
import { HTTPException } from "hono/http-exception";

export class TranslationService {
  constructor(private readonly translationRepository: TranslationRepository) {}

  async i8nTranslate(
    language: string,
    namespace: string,
  ): Promise<Record<string, string>> {
    return await this.translationRepository.i8nTranslate(language, namespace);
  }

  async findAll(): Promise<Translation[]> {
    return await this.translationRepository.findAll();
  }

  async findById(id: number): Promise<Translation> {
    const translation = await this.translationRepository.findById(id);
    if (!translation) {
      throw new HTTPException(404, { message: "Translation not found" });
    }
    return translation;
  }

  async create(data: TranslationInput): Promise<Translation> {
    return await this.translationRepository.createTranslation(data);
  }

  async bulkUpsertTranslation(
    data: TranslationInput[],
  ): Promise<Translation[]> {
    return await this.translationRepository.bulkUpsertTranslation(data);
  }

  async update(id: number, data: UpdateTranslationInput): Promise<Translation> {
    const translation = await this.translationRepository.updateTranslation(
      id,
      data,
    );
    if (!translation) {
      throw new HTTPException(404, { message: "Translation not found" });
    }
    return translation;
  }

  async delete(id: number): Promise<Translation> {
    const translation = await this.translationRepository.deleteTranslation(id);
    if (!translation) {
      throw new HTTPException(404, { message: "Translation not found" });
    }
    return translation;
  }
}
