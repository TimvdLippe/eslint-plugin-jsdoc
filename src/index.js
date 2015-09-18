import jscs from 'jscs';
import _ from 'lodash';

let checker,
    reportValidateSourceCode,
    validateSourceCode;

checker = new jscs();
checker.configure({
    "plugins": [
        require.resolve('jscs-jsdoc'),
    ]
});

/**
 * @typedef {Object} validateRule~error
 * @property {String} message
 * @property {Number} line
 * @property {Number} column
 */

/**
 * Validates a source code using a specific jscs-jsdoc rule and return an array of errors.
 *
 * @param {String} sourceCode
 * @param {String} ruleName
 * @param {Boolean|String|Object} ruleOptions
 * @returns {validateRule~error[]}
 */
validateSourceCode = (sourceCode, ruleName, ruleOptions) => {
    let results,
        errors;

    checker.configure({
        "jsDoc": {
            [ruleName]: ruleOptions
        }
    });

    results = checker.checkString(sourceCode);

    errors = results.getErrorList();

    // console.log('errors', errors);

    errors = _.map(errors, (error) => {
        return {
            message: error.message,
            line: error.line,
            column: error.column
        };
    });

    // console.log('errors', errors);

    return errors;
};

/**
 * @param {Object} context
 * @param {String} ruleName
 * @param {Boolean|String|Object} ruleOptions
 * @returns {undefined}
 */
reportValidateSourceCode = (context, ruleName, ruleOptions) => {
    let errors,
        sourceCode;

    sourceCode = context.getSourceCode().text;

    errors = validateSourceCode(sourceCode, ruleName, ruleOptions);

    _.forEach(errors, (error) => {
        let node;

        node = {
            loc: {
                start: {
                    line: error.line,
                    column: error.column
                }
            }
        };

        context.report(node, error.message);
    });
};

export default {
    rules: {
        'require-param-description': (context) => {
            // let options;
            // options = context.options[0] || {};

            reportValidateSourceCode(context, 'requireParamDescription', true);

            return {};
        }
    },
    rulesConfig: {
        'require-param-description': 0
    }
};