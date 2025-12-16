Feature: Specify Number of Events

  Scenario: When user hasn't set a number, 32 events are shown by default.
    Given the app is open
    When the user has not changed the number of events
    Then the user should see 32 events in the list

  Scenario Outline: User can change the number of events displayed.
    Given the app is open
    When the user sets the number of events to "<count>"
    Then the user should see <count> events in the list

    Examples:
      | count |
      | 10    |
      | 5     |

  Scenario: User sees as many events as available if fewer than requested.
    Given the app is open
    When the user sets the number of events to "1000"
    Then the user should see all available events
