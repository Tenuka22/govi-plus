import type { MessageAnnotation } from 'effect/SchemaAST';

export const createRegexParseErrorHandler =
  (fieldLabel: string) =>
  ({
    _tag,
    actual,
  }: {
    _tag: Parameters<MessageAnnotation>[0]['_tag'];
    actual: Parameters<MessageAnnotation>[0]['actual'];
  }) => {
    switch (_tag) {
      case 'Missing':
        return `${fieldLabel} is required`;
      case 'Type':
        return `${fieldLabel} must be a string`;
      case 'Refinement':
        return `Must be a valid ${fieldLabel.toLowerCase()}`;
      case 'Unexpected':
        return `Unexpected value for ${fieldLabel.toLowerCase()}`;
      case 'Forbidden':
        return `This ${fieldLabel.toLowerCase()} is not allowed`;
      default:
        return `Invalid ${fieldLabel.toLowerCase()}: ${String(actual)}`;
    }
  };
