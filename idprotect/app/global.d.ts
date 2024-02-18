declare module 'vue-slide-up-down' {}

interface PossibleError {
  name: string,
  description: string,
  validator: (inputs: { [key: string]: FormInput }) => boolean,
}

interface InputProps {
  type: string,
  name: string,
  label: string,
  placeholder: string,
  possibleErrors: PossibleError[],
}

interface FormInput extends InputProps {
  valid: boolean,
  value: string,
}
