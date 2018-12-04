import { Html } from '../types';

export default interface Page {
    init(): void;
    HTML(): Html;
}