Feature: Show/Hide Event Details

  Scenario: An event element is collapsed by default
    Given the app is open
    When the list of events is displayed
    Then each event's details are hidden by default

  Scenario: User can expand an event to see details
    Given the app is open
    And the list of events is displayed
    When the user clicks the "Show details" button on an event
    Then that event's details are shown

  Scenario: User can collapse an event to hide details
    Given the app is open
    And an event's details are visible
    When the user clicks the "Hide details" button on that event
    Then that event's details are hidden
