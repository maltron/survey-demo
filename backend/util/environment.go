package util

import "os"

// DefaultValue Try to fetch information from an environment variable.
// If it doesn't find, then returns the default value
func DefaultValue(environmentName string, defaultValue string) string {
	value, ok := os.LookupEnv(environmentName)
	if !ok {
		value = defaultValue
	}

	return value
}