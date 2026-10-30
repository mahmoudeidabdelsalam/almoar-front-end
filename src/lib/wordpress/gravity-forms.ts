import type {
  GravityFormChoice,
  GravityFormConditionalLogic,
  GravityFormDefinition,
  GravityFormField,
  GravityFormInput,
} from '@/types';

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  process.env.WORDPRESS_GRAPHQL_URL ||
  '';

function getWordPressApiRoot(): string {
  const configuredRoot = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL;
  if (configuredRoot) return configuredRoot.replace(/\/+$/, '');
  if (!GRAPHQL_URL) return '';

  const graphqlUrl = new URL(GRAPHQL_URL);
  graphqlUrl.pathname = graphqlUrl.pathname.replace(/\/graphql\/?$/, '').replace(/\/+$/, '');
  graphqlUrl.search = '';
  graphqlUrl.hash = '';
  return graphqlUrl.toString().replace(/\/+$/, '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function mapInput(value: unknown): GravityFormInput | null {
  if (!isRecord(value) || typeof value.id !== 'string') return null;
  return {
    id: value.id,
    label: asString(value.label),
    type: asString(value.type),
    isHidden: value.isHidden === true,
  };
}

function mapChoice(value: unknown): GravityFormChoice | null {
  if (!isRecord(value)) return null;
  return {
    text: asString(value.text),
    value: asString(value.value),
  };
}

function mapConditionalLogic(value: unknown): GravityFormConditionalLogic | null {
  if (!isRecord(value)) return null;

  const rules = Array.isArray(value.rules)
    ? value.rules.flatMap((rule) => {
        if (!isRecord(rule)) return [];
        return [{
          fieldId: String(rule.fieldId ?? ''),
          operator: asString(rule.operator),
          value: String(rule.value ?? ''),
        }];
      })
    : [];

  return {
    actionType: value.actionType === 'show' || value.actionType === 'hide' ? value.actionType : undefined,
    logicType: value.logicType === 'all' || value.logicType === 'any' ? value.logicType : undefined,
    rules,
  };
}

function mapField(value: unknown): GravityFormField | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.type !== 'string') return null;
  return {
    id: value.id,
    type: value.type,
    label: asString(value.label),
    description: asString(value.description),
    placeholder: asString(value.placeholder),
    isRequired: value.isRequired === true,
    inputs: Array.isArray(value.inputs) ? value.inputs.flatMap((input) => {
      const mapped = mapInput(input);
      return mapped ? [mapped] : [];
    }) : [],
    choices: Array.isArray(value.choices) ? value.choices.flatMap((choice) => {
      const mapped = mapChoice(choice);
      return mapped ? [mapped] : [];
    }) : [],
    conditionalLogic: mapConditionalLogic(value.conditionalLogic),
  };
}

export async function getGravityFormDefinition(formId: number | null): Promise<GravityFormDefinition | null> {
  if (!Number.isSafeInteger(formId) || !formId || formId < 1) return null;

  const apiRoot = getWordPressApiRoot();
  if (!apiRoot) {
    throw new Error('WordPress API endpoint is not configured for Gravity Forms.');
  }

  const response = await fetch(
    `${apiRoot}/wp-json/custom/v1/gravity-form?formId=${formId}`,
    { next: { revalidate: 60, tags: [`gravity-form-${formId}`] } },
  );
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Unable to load Gravity Form ${formId}: ${response.status} ${response.statusText}`.trim());
  }

  const body: unknown = await response.json();
  if (!isRecord(body) || body.id !== formId || !Array.isArray(body.fields)) {
    throw new Error(`WordPress returned an invalid definition for Gravity Form ${formId}.`);
  }

  return {
    id: formId,
    title: asString(body.title),
    buttonText: asString(body.buttonText),
    fields: body.fields.flatMap((field) => {
      const mapped = mapField(field);
      return mapped ? [mapped] : [];
    }),
  };
}

export function getWordPressRestEndpoint(): string {
  const apiRoot = getWordPressApiRoot();
  if (!apiRoot) {
    throw new Error('WordPress API endpoint is not configured for Gravity Forms.');
  }
  return `${apiRoot}/wp-json/custom/v1/gravity-form`;
}
