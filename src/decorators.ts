import { Vue } from 'vue/types/vue'
import { Prop } from 'vue/types/options'
import {
  ApolloVueThisType,
  VueApolloQueryOptions,
} from 'vue-apollo/types/options'
import { createDecorator } from 'vue-class-component'
import { DocumentNode } from 'graphql'

interface QueryOptions<C extends Vue, R = any, V = any>
  extends VueApolloQueryOptions<C, R> {
  variables: ((this: ApolloVueThisType<V>) => V) | V
}

/**
 * An Apollo Query
 * @param options VueApolloQueryOptions
 * @return PropertyDecorator | void
 */
export function Query<C extends Vue, R = any, V = any>(
  options: QueryOptions<C, R, V> | DocumentNode,
): PropertyDecorator {
  return createDecorator((componentOptions, key) => {
    if (!componentOptions.apollo) {
      componentOptions.apollo = {}
    }

    ;(componentOptions.apollo as any)[key] = {
      update: (data: any) =>
        Object.keys(data).includes(key) ? data[key] : data,
      ...options,
    }
  }) as any
}

export function Required(type: Prop<any>): PropertyDecorator {
  return createDecorator((componentOptions, key) => {
    if (!componentOptions.props) {
      componentOptions.props = {}
    }

    ;(componentOptions.props as any)[key] = {
      type,
      required: true,
    }
  }) as any
}

type Constructor =
  | NumberConstructor
  | StringConstructor
  | ArrayConstructor
  | BooleanConstructor
export function Default<T extends Constructor>(
  type: T,
  defaultValue: ReturnType<T>,
): PropertyDecorator {
  return createDecorator((componentOptions, key) => {
    if (!componentOptions.props) {
      componentOptions.props = {}
    }

    ;(componentOptions.props as any)[key] = {
      type,
      required: false,
      default: defaultValue,
    }

    // If the default value is an array or function it has to be a factory function
    if (Array.isArray(defaultValue) || typeof defaultValue === 'object') {
      ;(componentOptions.props as any)[key].default = () => defaultValue
    }
  }) as any
}
