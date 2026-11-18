import { ValidationError } from "../../utils/errors.js";

export class CitiesController {
  #citiesService;

  constructor(citiesService) {
    this.#citiesService = citiesService;
  }

  countByLetter = async (req, res) => {
    const letter =
      typeof req.query.letter === "string" ? req.query.letter.trim() : "";
    if (!/^[a-z]$/i.test(letter)) {
      throw new ValidationError(
        'Query parameter "letter" must be a single Latin letter',
      );
    }
    res.json(await this.#citiesService.countByFirstLetter(letter));
  };
}
